const apiUrl = "https://crudcrud.com/api/aa0893dde34f4e83a26770bcd859afdd/bookmarks";

document.addEventListener("DOMContentLoaded", fetchBookmarks);

function addBookmark() {
  const name = document.getElementById("bookmarkName").value;
  const url = document.getElementById("bookmarkURL").value;
//   const date = new Date().toLocaleDateString();

  if (!name || !url) return alert("Please fill in both fields!");

  const bookmark = { name, url, date };

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookmark)
  })
  .then(res => res.json())
  .then(() => {
    document.getElementById("bookmarkName").value = "";
    document.getElementById("bookmarkURL").value = "";
    fetchBookmarks();
  });
}

function fetchBookmarks() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("bookmarkList");
      list.innerHTML = "";
      data.forEach(bookmark => {
        const item = document.createElement("div");
        item.className = "bookmark-item";
        item.innerHTML = `
          <p><strong>${bookmark.name}</strong> (${bookmark.url})</p>
          <a class="visit-btn" href="${bookmark.url}" target="_blank">Visit</a>
          <button class="edit-btn" onclick="editBookmark('${bookmark._id}', '${bookmark.name}', '${bookmark.url}')">Edit</button>
          <button class="remove-btn" onclick="removeBookmark('${bookmark._id}')">Remove</button>
        `;
        list.appendChild(item);
      });
    });
}

function removeBookmark(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => fetchBookmarks());
}

function editBookmark(id, oldName, oldURL) {
  const newName = prompt("Enter new bookmark name:", oldName);
  const newURL = prompt("Enter new URL:", oldURL);

  if (!newName || !newURL) return;

  const updated = {
    name: newName,
    url: newURL,
    date: new Date().toLocaleDateString()
  };

  fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  }).then(() => fetchBookmarks());
}
