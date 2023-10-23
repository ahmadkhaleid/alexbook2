// // Initialization for ES Users
// import {
//     Modal,
//     Ripple,
//     initTE,
//   } from "tw-elements";
  
//   initTE({ Modal, Ripple });
  
//   const exampleModal = document.getElementById('exampleModalVarying');
//   exampleModal.addEventListener('show.te.modal', (e) => {
//     // Button that triggered the modal
//     const button = e.relatedTarget;
//     // Extract info from data-te-* attributes
//     const recipient = button.getAttribute('data-te-whatever');
//     // If necessary, you could initiate an AJAX request here
//     // and then do the updating in a callback.
//     //
//     // Update the modal's content.
//     const modalTitle = exampleModal.querySelector('#exampleModalVaryingLabel');
//     const modalBodyInput = exampleModal.querySelector('[data-te-modal-body-ref] input');
  
//     modalTitle.textContent = `New message to ${recipient}`;
//     modalBodyInput.value = recipient;
//   })
const baseUrl = "https://tarmeezacademy.com/api/v1"
getPosts()
addUserInfo()
function getPosts(empty = true, page = 1 ) {

  if(empty == true) {
    document.querySelector(".posts").innerHTML = "" // every time I call this func make Posts div empty and refill it again 
  }
  

  axios.get(`${baseUrl}/posts?limit=4&page=${page}`)
  .then(function (response) {
    let posts = response.data.data

    for(let post of posts) {
        if(typeof(post.author["profile_image"]) != "string") {
            post.author["profile_image"] = "./imgs/no-img.png"
        }
        if(post.title == null ) {
            post.title = ""
        }

        let content = `<div class="post mb-12 bg-white ">
        <div class="post-header">
          <img class="inline-block mr-2 rounded-full w-12 h-12" src=${post.author["profile_image"]} alt="">
          <span class=" text-lg font-medium">${post.author.name}</span>
        </div>
        <img class=" mt-4 shadow-md rounded-md w-full" src=${post.image} alt="">
        <p class=" p-1">${post["created_at"]}</p>
        <div class="post-content my-3">
          <h3 class="text-xl font-medium">${post.title}</h3>
          <p>${post.body}</p>
        </div>
        <hr>
        <svg class="inline-block w-[25px] h-[25px] fill-[#8e8e8e]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">

          <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
        
        </svg>
        <p class="inline-block mt-3">(${post.comments_count}) Comments</p>

      </div>
      <!-- End post -->`
      document.querySelector(".posts").innerHTML += content
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

  checkstatus()



  function signIn() {
   let userName = document.querySelector("#username").value
    let password = document.querySelector("#password").value
    axios.post(`${baseUrl}/login`, {
        "username": userName,
        "password": password
      })
      .then(function (response) {
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('user',JSON.stringify(response.data.user))
        document.querySelector(".close-btn").click()
        checkstatus()
        alertMessage("You logged in successfully")
        addUserInfo()
      }).catch((error)=> {
        alertMessage(error.response.data.message ,"bg-rose-500","text-white")
      })
  }
  function register() {
   let name = document.querySelector("#regi-name").value
   let userName = document.querySelector("#regi-username").value
    let password = document.querySelector("#regi-password").value
    let regiImage = document.querySelector("#regi-image").files[0]

    let formData = new FormData()
   formData.append("name",name)
   formData.append("username",userName)
   formData.append("password",password)
   formData.append("image",regiImage)
    axios.post(`${baseUrl}/register`, formData)
      .then(function (response) {
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('user',JSON.stringify(response.data.user))
        document.querySelector(".cancel-btn").click()
        checkstatus()
        alertMessage("New user has registered successfully")
      }).catch((error)=> {
        alertMessage(error.response.data.message ,"bg-rose-500","text-white")
      })
  }
  function addPost() {
   let title = document.querySelector("#post-title").value
   let postBody = document.querySelector("#post-body").value
   let postImage = document.querySelector("#post-image").files[0]
   const token = localStorage.getItem("token")
   let formData = new FormData()
   formData.append("title",title)
   formData.append("body",postBody)
   if(typeof(postImage) != "undefined") { // so you can make a post if there is image at image field 
    formData.append("image",postImage)
   }
   const headers = {"Authorization":`Bearer ${token}`}
    axios.post(`${baseUrl}/posts`, formData,{
        headers:headers
      })
      .then(function (response) {
        getPosts()    //todo
        document.querySelector(".done-post-btn").click()
        alertMessage("Post has created successfully")
      }).catch((error)=> {
        alertMessage(error.response.data.message ,"bg-rose-500","text-white")
      })  
  }

  function checkstatus() {
    let loginBtn = document.querySelector(".login-btn")
    let regiBtn = document.querySelector(".regi-btn")
    let logoutBtn = document.querySelector(".logout")
    let addPostBtn = document.querySelector(".add-post")
    if(localStorage.getItem("token")){
      loginBtn.style.display = "none"
      regiBtn.style.display = "none"
      logoutBtn.style.display = "flex"
      addPostBtn.style.display = "flex"
    } else {
      loginBtn.style.display = "flex"
      regiBtn.style.display = "flex"
      logoutBtn.style.display = "none"
      addPostBtn.style.display = "none"

    }
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    checkstatus()
    alertMessage("You logged out")
  }


  function alertMessage(message, type = "bg-success-100",text = "text-success-700") {
    document.querySelector(".alert-message").innerHTML = message
   let alrtDiv = document.querySelector(".alert")
   alrtDiv.classList.remove("bg-success-100","bg-rose-500","text-white","text-success-700")
   alrtDiv.classList.add(type,text)
   alrtDiv.classList.replace("hidden","inline-flex")
   setTimeout(() => {
    alrtDiv.classList.replace("inline-flex","hidden")
   },2000)
  }

  function addUserInfo() {
    if(localStorage.getItem("user")){
      let userFromStorage = localStorage.getItem("user")
      let user = JSON.parse(userFromStorage)
      if(typeof(user.profile_image) != "string") { //if user didnt load profile img
        user.profile_image  = "./imgs/no-img.png"
    }
      document.querySelector(".profile-img").src = user.profile_image
      document.querySelector(".profile-name").innerHTML = user.name
    }
  }

  let page = 1 // to set page number counter

window.addEventListener("scroll", ()=> {   
   // to know when reach the end of current page and get another page of posts
  let scrollH = document.documentElement.scrollHeight
  let scrollC = window.innerheight
  let scrollTop = document.documentElement.scrollTop

  if(scrollH <= Math.ceil(scrollC + scrollTop) ) {
    
    page++
    getPosts(false,page)
  }
  
})
