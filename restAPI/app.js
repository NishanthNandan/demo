const apiUrl = "https://crudcrud.com/api/2377fa50bacb4981a0e81276bc5c7410/bookmarks";
let currentEditingId = null;
window.onload = fetchBookmarks;

async function addBookmark() {
  const name = document.getElementById("bookmarkName").value.trim();
  const url = document.getElementById("bookmarkURL").value.trim();
  const errorMsg = document.getElementById("errorMessage");
  errorMsg.textContent = "";

  if (!name || !url) {
    errorMsg.textContent = "Please fill both fields.";
    return;
  }

  if (!isValidURL(url)) {
    errorMsg.textContent = "Invalid URL";
    return;
  }

  const bookmark = { name, url };

  try {
    if (currentEditingId) {
   
      await fetch(`${apiUrl}/${currentEditingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookmark),
      });

      currentEditingId = null;
      document.getElementById("addBtn").textContent = "Add Bookmark";
    } else {
      // 
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookmark),
      });
    }

    resetInputs();
    fetchBookmarks();
  } catch (error) {
    errorMsg.textContent = `Failed to save bookmark: ${error.message}`;
  }
}

async function fetchBookmarks() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const list = document.getElementById("bookmarkList");
    list.innerHTML = "";
    data.forEach((bookmark) => createBookmarkItem(bookmark));
  } catch (error) {
    document.getElementById("errorMessage").textContent = `Failed to fetch bookmarks: ${error.message}`;
  }
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
  visitBtn.onclick = () => window.open(bookmark.url, "_self");

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
  removeBtn.onclick = async () => {
    const errorMsg = document.getElementById("errorMessage");
    errorMsg.textContent = "";

    if (!navigator.onLine) {
      errorMsg.textContent = "Browser is offline. Cannot remove bookmark.";
      return;
    }

    try {
      await fetch(`${apiUrl}/${bookmark._id}`, { method: "DELETE" });
      fetchBookmarks();
    } catch (error) {
      errorMsg.textContent = `Failed to delete: ${error.message}`;
    }
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

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
