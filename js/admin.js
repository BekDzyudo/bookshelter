let addModal = document.querySelector(".addModal");
let editModal = document.querySelector(".editModal");
let addform = document.querySelector(".addform");
let editform = document.querySelector(".editform");
let bookTitle = document.getElementById("bookTitle");
let editbookTitle = document.getElementById("editbookTitle");
let author = document.getElementById("author");
let editauthor = document.getElementById("editauthor");
let category = document.getElementById("category");
let editcategory = document.getElementById("editcategory");
let price = document.getElementById("price");
let editprice = document.getElementById("editprice");
let date = document.getElementById("date");
let editdate = document.getElementById("editdate");
let rate = document.getElementById("rate");
let editrate = document.getElementById("editrate");
let imgUrl = document.getElementById("imgUrl");
let editimgUrl = document.getElementById("editimgUrl");
let add = document.querySelector(".add");
let addModalSave = document.getElementById("addModalSave");
let editModalSave = document.getElementById("editModalSave");
let list = document.getElementById("list");
let back = document.querySelector(".back");
let bookArr = [];
let starCountStr = "";
let starCountNum = 1;
let globalEditObj;
let newObj = {};
getAllBooks();

back.addEventListener("click", () => {
  window.location.replace("../user.html");
});

function addfunc(e) {
  e.preventDefault();
  let bookObj = {
    bookTitle: bookTitle.value,
    author: author.value,
    category: category.value,
    price: price.value,
    date: date.value,
    rate: rate.value,
    imgUrl: imgUrl.value,
  };
  Array.from(addform).forEach((item) => {
    if (item.value) {
      item.classList.remove("errorborder");
    } else {
      item.classList.add("errorborder");
    }
    item.addEventListener("change", (e) => {
      if (e.target.value) {
        item.classList.remove("errorborder");
      } else {
        item.classList.add("errorborder");
      }
    });
  });

  if (
    bookObj.author === "" ||
    bookObj.bookTitle === "" ||
    bookObj.category === "" ||
    bookObj.date === "" ||
    bookObj.imgUrl === "" ||
    bookObj.price === "" ||
    bookObj.rate === ""
  ) {
    alert("barcha maydonlar to'ldirilishi shart !");
  } else {
    fetch("https://kitoblar-e0436-default-rtdb.firebaseio.com/books.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookObj),
    })
      .then((res) => {
        if (!res.ok) throw new Error("nimadir xato");
        return res.json();
      })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        addModalSave.innerHTML = "Save";
        addform.reset();
        addModal.style.display = "none";
        getAllBooks();
      });

    addModalSave.innerHTML = `
      <div
      style="width: 20px; height: 20px"
      class="spinner-border text-light"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
      `;
  }
}

function renderHtml() {
  let result = bookArr
    .map((item1, index) => {
      for (let j = 0; j < +item1.rate; j++) {
        starCountStr += `<img
      style="width: 25px; height: 25px"
      src="img/star.svg/starr.svg"
      alt=""
    />`;
      }

      let priceFormat = item1.price.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      let d = new Date(item1.date);

      let datestring =
        d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();

      let result = `
  <li class="item">
  <div class="image">
    <img src=${item1.imgUrl} alt="" />
  </div>
  <div class="bookContent">
    <h3 class="booktitle">${item1.bookTitle}</h3>
    <h3>
      by <span class="bookAuthor">${item1.author}</span>,
      <span class="bookCategory">${item1.category}</span>, at al.|
      <span class="date">${datestring}</span>
    </h3>
    <div class="rate">
     ${starCountStr}
    </div>
    <h3 class="bookPrice">Cost: ${priceFormat}</h3>
    <div class="btnShow">
      <div>
        <button onclick="editFunc(${index})">Edit</button>
        <button onclick="delFunc(${index})">Delete</button>
      </div>
    </div>
  </div>
</li>
  `;
      return result;
    })
    .join(" ");
  list.innerHTML = result;
}

function getAllBooks() {
  fetch("https://kitoblar-e0436-default-rtdb.firebaseio.com/books.json")
    .then((res) => {
      if (!res.ok) throw new Error("nimadir xato");
      return res.json();
    })
    .then((res) => {
      bookArr = Object.values(res || {}).map((item, index) => {
        return { ...item, id: Object.keys(res)[index] };
      });

      renderHtml();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {});
}

function delFunc(id) {
  let findElement = bookArr.find((item, index) => {
    return index === id;
  });
  console.log(findElement.id);
  fetch(
    `https://kitoblar-e0436-default-rtdb.firebaseio.com/books/${findElement.id}.json`,
    {
      method: "DELETE",
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error("nimadir xato");
      return res.json();
    })
    .then((res) => {
      console.log("malumot o'chdi");
    })
    .catch((err) => {
      console.log("nimadir xato");
    })
    .finally(() => {
      getAllBooks();
    });
}

function editFunc(id) {
  editModal.style.display = "block";
  let findElement = bookArr.find((item, index) => {
    return index === id;
  });
  let findElementIndex = bookArr.findIndex((item, index) => {
    return index === id;
  });

  editbookTitle.value = findElement.bookTitle;
  editauthor.value = findElement.author;
  editcategory.value = findElement.category;
  editdate.value = findElement.date;
  editprice.value = findElement.price;
  editrate.value = findElement.rate;
  editimgUrl.value = findElement.imgUrl;

  globalEditObj = {
    index: findElementIndex,
    id: findElement.id,
  };
}

function editElementFunc(e) {
  e.preventDefault();

  newObj = {
    id: globalEditObj.id,
    author: editauthor.value,
    bookTitle: editbookTitle.value,
    price: editprice.value,
    category: editcategory.value,
    imgUrl: editimgUrl.value,
    rate: editrate.value,
    date: editdate.value,
  };

  fetch(
    `https://kitoblar-e0436-default-rtdb.firebaseio.com/books/${newObj.id}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newObj),
    }
  )
    .then((res) => {
      if (!res.ok) throw new Error("nimadir xato");
      return res.json();
    })
    .then((res) => {
      getAllBooks();
    })
    .catch((err) => {
      // console.log("nimadir xato");
    })
    .finally(() => {
      editModalSave.innerHTML = "Edit";
      editModal.style.display = "none";
    });
  editModalSave.innerHTML = `
    <div
    style="width: 20px; height: 20px"
    class="spinner-border text-light"
    role="status"
  >
    <span class="visually-hidden">Loading...</span>
  </div>
    `;
}

add.addEventListener("click", () => {
  addModal.style.display = "block";
});
addModalSave.addEventListener("click", addfunc);
editModalSave.addEventListener("click", editElementFunc);
