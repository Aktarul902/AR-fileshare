const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL")
const toast = document.querySelector(".toast");
copyURLBtn.addEventListener("click", () => {
    fileURL.select();
    document.execCommand("copy");
    showToast("Copied to clipboard");
  });
  
  fileURL.addEventListener("click", () => {
    fileURL.select();
  });
  let toastTimer;
  function showToast(msg){
    clearTimeout(toastTimer);
    toast.innerText = msg;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
