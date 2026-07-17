

// 🔹 TAB SWITCH
function showTab(type){
  document.getElementById("classForm").style.display = "none";
  document.getElementById("bookForm").style.display = "none";
  document.getElementById("testForm").style.display = "none";

  if(type === "class"){
    document.getElementById("classForm").style.display = "block";
  }
  else if(type === "book"){
    document.getElementById("bookForm").style.display = "block";
  }
  else{
    document.getElementById("testForm").style.display = "block";
  }
}





// 🔸 CLASS DATA
function previewClass(){

  const file = document.getElementById("imageFile").files[0];

  if(file){
    const url = URL.createObjectURL(file);
    document.getElementById("previewImg").src = url;
    document.getElementById("previewImg").style.display = "none";
    document.getElementById("cardImg").src = url;
  }

  document.getElementById("clsname").innerText =
    document.getElementById("className").value;

  document.getElementById("eduname").innerText =
    document.getElementById("educator").value;

  document.getElementById("appname").innerText =
    document.getElementById("appName").value;

  document.getElementById("bookname").innerText =
    document.getElementById("books").value;

  document.getElementById("offername").innerText =
    document.getElementById("offer").value;

  document.getElementById("ytlink").href =
    document.getElementById("yt").value;

  document.getElementById("tglink").href =
    document.getElementById("tg").value;

  document.getElementById("walink").href =
    document.getElementById("wa").value;

}

document.addEventListener("DOMContentLoaded", function(){

  document.getElementById("className").addEventListener("input", previewClass);
  document.getElementById("educator").addEventListener("input", previewClass);
  document.getElementById("appName").addEventListener("input", previewClass);
  document.getElementById("books").addEventListener("input", previewClass);
  document.getElementById("offer").addEventListener("input", previewClass);

  document.getElementById("yt").addEventListener("input", previewClass);
  document.getElementById("tg").addEventListener("input", previewClass);
  document.getElementById("wa").addEventListener("input", previewClass);

  document.getElementById("imageFile").addEventListener("change", previewClass);

});


function addClass(){

  const formData = new FormData();

  formData.append("className", document.getElementById("className").value);
  formData.append("image", document.getElementById("imageFile").files[0]);
  formData.append("image2", document.getElementById("imageFile2").files[0]);
  formData.append("educator", document.getElementById("educator").value);
  formData.append("exam", document.getElementById("exam").value);
  formData.append("subject", document.getElementById("subject").value);
  formData.append("appName", document.getElementById("appName").value);
  formData.append("books", document.getElementById("books").value);
  formData.append("offer", document.getElementById("offer").value);
  formData.append("appLink", document.getElementById("applink").value);
  formData.append("demoVideo", document.getElementById("demoVideo").value);


  // ✅ social media links add कर
  formData.append("yt", document.getElementById("yt").value);
  formData.append("tg", document.getElementById("tg").value);
  formData.append("wa", document.getElementById("wa").value);
  formData.append("io", document.getElementById("io").value);
  formData.append("wb", document.getElementById("wb").value);


  fetch("http://localhost:5000/addClass", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    alert("Saved!");
  })
  .catch(err => console.log(err));
}




// 🔸 BOOK DATA
function addBook(){
  document.getElementById("clsname").innerText =
    document.getElementById("b_name").value;

  document.getElementById("cardImg").src =
    document.getElementById("b_img").value;

  document.getElementById("eduname").innerText =
    document.getElementById("b_author").value;

  document.getElementById("appname").innerText = "Book";

  document.getElementById("bookname").innerText =
    document.getElementById("b_name").value;

  document.getElementById("offername").innerText =
    document.getElementById("b_offer").value;
}

document.getElementById("imageFile").addEventListener("change", function(e){
  const file = e.target.files[0];

  if(file){
    const previewURL = URL.createObjectURL(file);
    document.getElementById("previewImg").src = previewURL;

    // right side card preview
    document.getElementById("cardImg").src = previewURL;
  }
});

function showSection(type){

  document.getElementById("addSection").style.display = "none";
  document.getElementById("manageSection").style.display = "none";

  if(type === "add"){
    document.getElementById("addSection").style.display = "block";
  } else {
    document.getElementById("manageSection").style.display = "block";
    loadData();
  }
}



function loadData(){

  fetch("http://localhost:5000/getClasses")
  .then(res => res.text())
  .then(text => {
    const data = JSON.parse(text);

    const table = document.getElementById("tableBody");
    table.innerHTML = "";

    data.forEach(item => {

      const imgSrc = item.imgUrl.startsWith("http")
        ? item.imgUrl
        : `http://localhost:5000/uploads/${item.imgUrl}`;

      const row = `
        <tr>
          <td>${item.className}</td>
          <td><img src="${imgSrc}" width="60"></td>
          <td>${item.educator}</td>
          <td>${item.appName}</td>
          <td>${item.books}</td>
          <td>${item.offer}</td>
          <td>${getLinkIcon(item.appLink, 'appLink', item._id)}</td>
          <td>${getLinkIcon(item.yt, 'yt', item._id)}</td>
          <td>${getLinkIcon(item.tg, 'tg', item._id)}</td>
          <td>${getLinkIcon(item.wa, 'wa', item._id)}</td>
          <td>${getLinkIcon(item.ig, 'io', item._id)}</td>
          <td>${getLinkIcon(item.ig, 'wb', item._id)}</td>



          <td>
            <button onclick="deleteData('${item._id}')">🗑️</button>
            <button onclick="editData('${item._id}')">✏️</button>
          </td>
        </tr>
      `;

      table.innerHTML += row;
    });

  });
}



function deleteData(id){

  console.log("STEP 1 - Button Click", id);

  fetch(`http://localhost:5000/deleteClass/${id}`, {
    method: "DELETE"
  })
  .then(res => {
    console.log("STEP 2 - Status:", res.status);
    return res.text(); // 👈 IMPORTANT CHANGE
  })
  .then(data => {
    console.log("STEP 3 - Data:", data);

    alert("Deleted ✅");
    loadData();
  })
  .catch(err => {
    console.log("ERROR:", err);
  });

}

function editData(id){
  console.log("Edit clicked:", id); // 👈 test
}


const btn = document.getElementById("submitBtn");
let editId = null;

if(editId){
  btn.innerText = "Update Class";
}else{
  btn.innerText = "Add Class";
}

function editData(id){

  showSection("add"); // 👈 MUST FIRST

  fetch(`http://localhost:5000/getClasses`)
    .then(res => res.json())
    .then(data => {

      const item = data.find(d => d._id === id);

      // 👇 form fill
      document.getElementById("className").value = item.className;
      document.getElementById("educator").value = item.educator;
      document.getElementById("appName").value = item.appName;
      document.getElementById("books").value = item.books;
      document.getElementById("offer").value = item.offer;
      document.getElementById("appLink").value = item.appLink;
      document.getElementById("demoVideo").value = item.demoVideo;
      document.getElementById("yt").value = item.yt;
      document.getElementById("tg").value = item.tg;
      document.getElementById("wa").value = item.wa;
      document.getElementById("io").value = item.io;
      document.getElementById("wb").value = item.wb;


      // 👇 edit mode set
      editId = id;

      // 👇 AddClasses tab open कर
      showSection("add");

      // 👇 preview update
      previewClass();

    });

}

function getLinkIcon(link, type, id){
  if(link && link.trim() !== ""){
    return `<span style="color:green; cursor:pointer;" 
            onclick="handleLink('${id}','${type}','${link}')">✔️</span>`;
  } else {
    return `<span style="color:red; cursor:pointer;" 
            onclick="handleLink('${id}','${type}','')">❌</span>`;
  }
}

function handleLink(id, type, link){

  let newLink;

  if(link){
    // already exists → edit
    newLink = prompt("Edit Link:", link);
  } else {
    // new add
    newLink = prompt("Enter New Link:");
  }

  if(newLink === null) return;

  fetch(`http://localhost:5000/updateLink/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      field: type,
      value: newLink
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Updated ✅");
    loadData();
  })
  .catch(err => console.log(err));
}



// 🔸 TEST SERIES DATA
function addTest(){

  const formData = new FormData();

  formData.append("className", document.getElementById("t_className").value);
  formData.append("image", document.getElementById("t_imageFile").files[0]);
  formData.append("exam", document.getElementById("t_exam").value);
  formData.append("subject", document.getElementById("t_subject").value);
  formData.append("appName", document.getElementById("t_appName").value);
  formData.append("offer", document.getElementById("t_offer").value);
  formData.append("call", document.getElementById("t_call").value);
  formData.append("appLink", document.getElementById("t_applink").value);

  formData.append("yt", document.getElementById("t_yt").value);
  formData.append("tg", document.getElementById("t_tg").value);
  formData.append("wa", document.getElementById("t_wa").value);
  formData.append("ig", document.getElementById("t_ig").value);
  formData.append("io", document.getElementById("t_io").value);
  formData.append("wb", document.getElementById("t_wb").value);

  fetch("http://localhost:5000/addTest", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(() => {
    alert("Saved ✅");
    loadTests();
  });
}

function previewTest(){

  // ✅ values घे
  const name = document.getElementById("t_className").value;
  const exam = document.getElementById("t_exam").value;
  const app = document.getElementById("t_appName").value;
  const subject = document.getElementById("t_subject").value;
  const offer = document.getElementById("t_offer").value;

  // ✅ preview card update
  document.getElementById("clsname").innerText = name;
  document.getElementById("eduname").innerText = exam;
  document.getElementById("appname").innerText = app;
  document.getElementById("bookname").innerText = subject;
  document.getElementById("offername").innerText = offer;

  // ✅ image preview
  const file = document.getElementById("t_imageFile").files[0];
  if(file){
    document.getElementById("cardImg").src = URL.createObjectURL(file);
  }

  // ✅ links preview (optional)
  document.getElementById("ytlink").href =
    document.getElementById("t_yt").value;

  document.getElementById("tglink").href =
    document.getElementById("t_tg").value;

  document.getElementById("walink").href =
    document.getElementById("t_wa").value;

  document.getElementById("iolink").href =
    document.getElementById("t_io").value;

  document.getElementById("wblink").href =
    document.getElementById("t_wb").value;
}

document.addEventListener("DOMContentLoaded", function(){

  document.getElementById("t_className").addEventListener("input", previewTest);
  document.getElementById("t_exam").addEventListener("input", previewTest);
  document.getElementById("t_appName").addEventListener("input", previewTest);
  document.getElementById("t_subject").addEventListener("input", previewTest);
  document.getElementById("t_offer").addEventListener("input", previewTest);

  document.getElementById("t_imageFile").addEventListener("change", previewTest);

  document.getElementById("t_yt").addEventListener("input", previewTest);
  document.getElementById("t_tg").addEventListener("input", previewTest);
  document.getElementById("t_wa").addEventListener("input", previewTest);
  document.getElementById("t_io").addEventListener("input", previewTest);
  document.getElementById("t_wb").addEventListener("input", previewTest);

});

function loadTests(){

  fetch("http://localhost:5000/getTests")
  .then(res => res.json())
  .then(data => {

    const table = document.getElementById("tableBody");
    table.innerHTML = "";

    data.forEach(item => {

      const img = `http://localhost:5000/uploads/${item.imgUrl}`;

      const row = `
        <tr>
          <td>${item.className}</td>
          <td><img src="${img}" width="60"></td>
          <td>${item.exam}</td>
          <td>${item.appName}</td>
          <td>${item.subject}</td>
          <td>
            <button onclick="deleteTest('${item._id}')">🗑️</button>
          </td>
        </tr>
      `;

      table.innerHTML += row;
    });

  });
}

function deleteTest(id){

  fetch(`http://localhost:5000/deleteTest/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Deleted ✅");
    loadTests();
  });
}

function addBook(){

  const formData = new FormData();

  formData.append("className", document.getElementById("b_className").value);
  formData.append("educator", document.getElementById("b_educator").value);
  formData.append("bookName", document.getElementById("b_bookName").value);
  formData.append("price", document.getElementById("b_price").value);
  formData.append("rating", document.getElementById("b_rating").value);
  formData.append("bookLink", document.getElementById("b_bookLink").value);

  formData.append("yt", document.getElementById("b_yt").value);
  formData.append("call", document.getElementById("b_call").value);
  formData.append("wa", document.getElementById("b_wa").value);
  formData.append("ig", document.getElementById("b_ig").value);
  formData.append("tg", document.getElementById("b_tg").value);
  formData.append("io", document.getElementById("b_io").value);

  const file = document.getElementById("b_imageFile").files[0];
  if(file){
    formData.append("image", file);
  }

  fetch("http://localhost:5000/addBook", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    alert("Book Added ✅");
    console.log(data);
  })
  .catch(err => console.log(err));
}

function updatePreview(){

  document.getElementById("clsname").innerText =
    document.getElementById("b_className").value || "Title";

  document.getElementById("eduname").innerText =
    document.getElementById("b_educator").value || "---";

  document.getElementById("appname").innerText =
    document.getElementById("b_bookName").value || "---";

  document.getElementById("bookname").innerText =
    document.getElementById("b_price").value || "---";

  document.getElementById("offername").innerText =
    document.getElementById("b_rating").value || "---";

  document.getElementById("app").innerText =
    document.getElementById("b_bookLink").value || "---";
}

function previewImage(event){

  const file = event.target.files[0];

  if(file){
    document.getElementById("cardImg").src = URL.createObjectURL(file);
  }
}

document.querySelectorAll("#bookForm input").forEach(input => {
  input.addEventListener("input", updatePreview);
});

document.getElementById("b_imageFile")
  .addEventListener("change", previewImage);