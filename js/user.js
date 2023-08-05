let booksBloks = document.querySelector(".booksBloks");
let bookmarkList = document.querySelector(".bookmarkList");
let resultElement = document.getElementById("resultElement");
let search = document.getElementById("search");
let bookmarkId = document.getElementById("bookmarkId");
let logoutBtn = document.getElementById("logoutBtn");
let bookArrUser = [];
let BookmarkArr = [];
let BookmarkArrRender = [];
let searchArr = [];
getAllBooksUser();
getAllBookmark();

logoutBtn.addEventListener("click", () => {
  window.location.replace("../login.html");
});

function getAllBooksUser() {
  fetch("https://kitoblar-e0436-default-rtdb.firebaseio.com/books.json")
    .then((res) => {
      if (!res.ok) throw new Error("nimadir xato");
      return res.json();
    })
    .then((res) => {
      bookArrUser = Object.values(res || {}).map((item, index) => {
        BookmarkArr.push({ ...item, id: Object.keys(res)[index] });
        return { ...item, id: Object.keys(res)[index] };
      });
      resultElement.innerHTML = BookmarkArr.length;
      renderHtmlUser();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {});
}

function renderHtmlUser() {
  let result = bookArrUser
    .map((item1, index) => {
      let priceFormat = item1.price.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      let d = new Date(item1.date);
      let datestring =
        d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();

      let result = `
      <div class="bookItem">
      <div class="bookItemImg">
        <img src="${item1.imgUrl}" alt="" />
      </div>
      <div class="bookItemDesc">
        <p>${item1.bookTitle}</p>
        <p>${item1.author}</p>
        <p>${datestring}</p>
        <p>${item1.category}</p>
        <p>rate: ${item1.rate}</p>
        <p>price: ${priceFormat}</p>
      </div>
      <div class="bookItemBtnShow">
        <button id="bookmarkId" onclick="bookmarkAddFunc(${index})">Bookmark</button>
        <button>More Info</button>
      </div>
      <button>Read</button>
    </div>
    `;
      return result;
    })
    .join(" ");
  booksBloks.innerHTML = result;
}

function bookmarkAddFunc(id) {
  let findElement = BookmarkArr.find((item, index) => {
    return id === index;
  });
  if (!BookmarkArrRender) {
    fetch("https://kitoblar-e0436-default-rtdb.firebaseio.com/bookmark.json", {
      method: "POST",
      headers: { "Content-Type": "Aplication/json" },
      body: JSON.stringify(findElement),
    })
      .then((res) => {
        if (!res.ok) throw new Error("nimadir xato");
        return res.json();
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        getAllBookmark();
      });
  } else {
    BookmarkArrRender.forEach((item) => {
      if (item.bookTitle !== findElement.bookTitle) {
        fetch(
          "https://kitoblar-e0436-default-rtdb.firebaseio.com/bookmark.json",
          {
            method: "POST",
            headers: { "Content-Type": "Aplication/json" },
            body: JSON.stringify(findElement),
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("nimadir xato");
            return res.json();
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            getAllBookmark();
          });
      } else {
        alert("bu kitob koorzinkaga saqlangan");
      }
    });
  }
}

function searchFunc() {
  let result = searchArr
    .map((item1, index) => {
      let priceFormat = item1.price.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      let d = new Date(item1.date);
      let datestring =
        d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();

      let result = `
      <div class="bookItem">
      <div class="bookItemImg">
        <img src="${item1.imgUrl}" alt="" />
      </div>
      <div class="bookItemDesc">
        <p>${item1.bookTitle}</p>
        <p>${item1.author}</p>
        <p>${datestring}</p>
        <p>${item1.category}</p>
        <p>rate: ${item1.rate}</p>
        <p>price: ${priceFormat}</p>
      </div>
      <div class="bookItemBtnShow">
        <button id="bookmarkId" onclick="bookmarkAddFunc(${index})">Bookmark</button>
        <button>More Info</button>
      </div>
      <button>Read</button>
    </div>
    `;
      return result;
    })
    .join(" ");
  booksBloks.innerHTML = result;
}

search.addEventListener("input", (e) => {
  if (e.target.value === "") {
    searchArr = bookArrUser;
  }
  if (e.target.value) {
    searchArr = bookArrUser.filter((item) => {
      return item.bookTitle
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
  }
  searchFunc();
  resultElement.innerHTML = searchArr.length;
});

function getAllBookmark() {
  fetch("https://kitoblar-e0436-default-rtdb.firebaseio.com/bookmark.json")
    .then((res) => {
      if (!res.ok) throw new Error("nimadir xato");
      return res.json();
    })
    .then((res) => {
      BookmarkArrRender = Object.values(res || {}).map((item, index) => {
        return { ...item, id: Object.keys(res)[index] };
      });
      renderHtmlUserBookmark();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {});
}

function renderHtmlUserBookmark() {
  let result = BookmarkArrRender.map((item1, index) => {
    let result = `
      <li class="bookmarkItem">
              <div class="leftBookmark">
                <h4>${item1.bookTitle}</h4>
                <p>${item1.author}</p>
              </div>
              <div class="bookmarkBtnShow">
                <img src="img/book_open.svg" alt="" />
                <img src="img/delete.svg" alt="" onclick="delBookmark(${index})" />
              </div>
            </li>
    `;
    return result;
  }).join(" ");
  bookmarkList.innerHTML = result;
}

function delBookmark(id) {
  findElement = BookmarkArrRender.find((item, index) => {
    return index === id;
  });
  renderHtmlUserBookmark();

  fetch(
    `https://kitoblar-e0436-default-rtdb.firebaseio.com/bookmark/${findElement.id}.json`,
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
      console.log(err);
    })
    .finally(() => {
      getAllBookmark();
    });
}
