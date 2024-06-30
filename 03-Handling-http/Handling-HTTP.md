# Handling HTTP

<details>
<summary>Index</summary>

## Index
* Response Methods
* Request Methods
</details>

---

<details>
<summary>response methods</summary>

## response methods
* send
* sendStatus
* sendFile

```js
// 01 send -> send some data -> response.send(data);
app.get("/data", (request, response) => {
    const data = {
        name: "Ande Praveen",
        age: 28
    }
   response.send(data);
})

// 02 sendStatus -> send status code -> response.status(code);
app.get("/status", (request, response) => {
    response.sendStatus(200);
})

// 03 sendFile -> sending a File -> response.sendFile(PATH, {root: __dirname });
app.get("/file", (request, response) => {
    response.sendFile("./Assets/page.html", {root: __dirname })
})
```

</details>


---

<details>
<summary>Request Methods</summary>

## Request Methods
* Dynamic Parameter
* Query Parameter

</details>

