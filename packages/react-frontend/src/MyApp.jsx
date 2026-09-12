import { useEffect, useState } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:8000/users");
        const data = await response.json();
        setCharacters(data["users_list"]);
      } catch (e) {
        console.log(e);
      }
    }
    fetchUsers();
  }, []);
  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );

  function removeOneCharacter(index) {
    const updated = characters.filter((_, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }
  async function updateList(person) {
    try {
      const response = await postUser(person);
      if (response.status != 201) {
        throw Error;
      }
      setCharacters([...characters, person]);
    } catch (error) {
      console.log(error);
    }
  }

  // src/MyApp.js (a new inner function inside MyApp())

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }
}
export default MyApp;
