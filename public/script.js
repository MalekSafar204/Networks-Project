async function addToList(e, name) {
  e.preventDefault();
  const response = await fetch(`/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
    }),
  });

  const { success, message } = await response.json();
  if (success) {
    alert(message);
  } else {
    alert(message);
  }
}

async function Search(e, params) {
  e.preventDefault();
  const response = await fetch("/searchresults", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      param: params,
    }),
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
}
