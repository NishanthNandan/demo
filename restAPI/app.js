const apiUrl = "https://crudcrud.com/api/aa0893dde34f4e83a26770bcd859afdd/bookmarks";
let currentEditingId = null;
window.onload = fetchBookmarks;

function addBookmark() {
  const name = document.getElementById("bookmarkName").value.trim();
  const url = document.getElementById("bookmarkURL").value.trim();
  if (!name || !url) return alert("Please fill both fields.");
  const bookmark = { name, url };
  if (currentEditingId) {
    fetch(`${apiUrl}/${currentEditingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookmark),
    })
      .then(() => {
        currentEditingId = null;
        document.getElementById("addBtn").textContent = "Add Bookmark";
        resetInputs();
        fetchBookmarks();
      });
  } else {
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookmark),
    })
      .then(() => {
        resetInputs();
        fetchBookmarks();
      });
  }
}

function fetchBookmarks() {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("bookmarkList");
      list.innerHTML = "";
      data.forEach((bookmark) => createBookmarkItem(bookmark));
    });
}

function createBookmarkItem(bookmark) {
  const listItem = document.createElement("div");
  listItem.className = "bookmark-item";

  const info = document.createElement("div");
  info.className = "bookmark-info";
  info.textContent = `${bookmark.name} - ${bookmark.url}`;

  const visitBtn = document.createElement("button");
  visitBtn.textContent = "Visit";
  visitBtn.className = "visit-btn";
  visitBtn.onclick = () => window.open(bookmark.url,"_self");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.onclick = () => {
    document.getElementById("bookmarkName").value = bookmark.name;
    document.getElementById("bookmarkURL").value = bookmark.url;
    document.getElementById("addBtn").textContent = "Update Bookmark";
    currentEditingId = bookmark._id;
  };

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "remove-btn";
  removeBtn.onclick = () => {
    fetch(`${apiUrl}/${bookmark._id}`, { method: "DELETE" })
      .then(() => fetchBookmarks());
  };

  listItem.appendChild(info);
  listItem.appendChild(visitBtn);
  listItem.appendChild(editBtn);
  listItem.appendChild(removeBtn);

  document.getElementById("bookmarkList").appendChild(listItem);
}

function resetInputs() {
  document.getElementById("bookmarkName").value = "";
  document.getElementById("bookmarkURL").value = "";
}
