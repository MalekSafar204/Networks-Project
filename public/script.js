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
