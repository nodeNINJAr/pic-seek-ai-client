import { useContext } from "react";
import PageTitle from "../components/shared/PageTitle";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";

const Create = () => {
  const { user, login } = useContext(AuthContext);
  const options = [
    "painting",
    "animated-image",
    "walpaper",
    "poster",
    "digital-art",
    "realistic-image",
  ];

  const checkUser = () => {
    if (!user) {
      Swal.fire({
        title: "Please Login",
        text: "Join as a Creator with One Click",
        imageUrl: "https://img.icons8.com/?size=100&id=szz75vJoS2OI&format=gif",
        imageHeight: "80px",
        imageAlt: "Custom image",
        showCancelButton: true,
        confirmButtonText: `Login using Google`,
        confirmButtonColor: "#149b9b",
      }).then((res) => {
        if (res.isConfirmed) {
          login()
            .then((res) => {
              const user = res.user;
              console.log(user);
              Swal.fire("success", "Welcome", "success");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
      return false;
    } else {
      return true;
    }
  };
  //
  const validate = (prompt, category) => {
    // validation starts
    if (!category) {
      Swal.fire(
        "Select Category",
        "Select a Category from the dropdown",
        "error"
      );
      return false;
    }
    if (!prompt) {
      Swal.fire("Write a Prompt", "Write a prompt in the input", "error");
      return;
    }
    if (!prompt) {
      Swal.fire("Write a Prompt", "Write a prompt in the input", "error");
      return false;
    }
    if (prompt.trim().length < 20) {
      Swal.fire(
        "Invalid Prompt",
        "make your prompt bigger (minimum 20 character)",
        "error"
      );
      return false;
    }
    //validation End
    console.log({ prompt, category });
    const finalPrompt = `imagine a ${category} : ${prompt}`;
    console.log(finalPrompt);
    return true;
  };
  //
  // const getImageBuffer = async (prompt, category) => {
  //   const finalPrompt = `image a ${category} : ${prompt}`;
  //   //
  //   const formValue = new FormData();
  //   formValue.append("prompt", finalPrompt);

  //   const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
  //     method: "POST",
  //     headers: {
  //       "x-api-key": import.meta.env.VITE_clipdrop_api,
  //     },
  //     body: formValue,
  //   });
  //   const buffer = await response.arrayBuffer();
  //   return buffer ;

  // };
  // 
  const genarateImageUrl = async(buffer)=>{
    const blob = new Blob([buffer], { type: "image/png" });
    const form = new FormData();
    form.append("image", blob)
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_BB_API_KEY}`,{
      method:"POST",
      body:form
    });
    const imageUrl = await response.json();
    return imageUrl
  }
  //
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!checkUser()) return;
    //
    const form = e.target;
    const prompt = form.prompt.value;
    const category = form.category.value;
    if (!validate(prompt, category)) {
      return;
    }
    // 
    const buffer = await getImageBuffer(prompt,category);
    // 
    const imageUrl = await genarateImageUrl(buffer);
    console.log(imageUrl);
  };


  //
  return (
    <div>
      <PageTitle>🌱Let&apos;s Create 🐦‍🔥</PageTitle>

      <div className="w-11/12 mx-auto py-10">
        <div className="flex justify-center py-5">
          <img
            src="https://img.icons8.com/?size=96&id=8gR77jBNhfyz&format=png"
            alt=""
            className="animate-bounce"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="join w-full justify-center flex-wrap"
        >
          <div className="flex-1">
            <div className="">
              <input
                name="prompt"
                className="input w-full input-bordered join-item outline-none focus:outline-none focus:border-primary"
                placeholder="Write , Whats on your Mind🧠🧠"
              />
            </div>
          </div>
          <select
            name="category"
            className="select select-bordered join-item max-w-max outline-none focus:outline-none focus:border-primary"
          >
            <option value="">Select a Category</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="indicator">
            <button className="btn join-item btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
