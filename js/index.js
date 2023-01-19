document.addEventListener("DOMContentLoaded", function() {
    const userName = "BRICKNET_BABYBOY";
    const userId = 100;
    
    const list = document.querySelector('ul#list');
    const mainPanel = document.querySelector('div#show-panel');
    
    function renderList(books){
        const thumbnail = document.createElement('img');
        thumbnail.setAttribute('src', books.img_url);

        const title = document.createElement('h2');
        title.classList.add('title');
        title.textContent = books.title;

        const subtitle = document.createElement('h2');
        subtitle.classList.add('subtitle');
        subtitle.textContent = books.subtitle;

        const author = document.createElement('h2');
        author.classList.add('author');
        author.textContent = books.author;

        const description = document.createElement('p');
        description.classList.add('description');
        description.textContent = books.description;

        const likeBtn = document.createElement('button');
        likeBtn.classList.add('btn');
        likeBtn.setAttribute("style", "cursor: pointer")
        likeBtn.textContent = 'Like';

        const userList = document.createElement('ul');
        userList.classList.add('user-list');
        userList.textContent = 'Liked by:';
        const bookLikers = books.users.map(user => {return user.username});
        bookLikers.forEach(user => {
            const listItem = document.createElement('li')
            listItem.setAttribute("id", user)
            listItem.setAttribute("style", "cursor: pointer")
            listItem.textContent = user;
            userList.append(listItem);
        });
        
        
        likeBtn.addEventListener('click', () => {
            if (likeBtn.textContent === 'Like'){
            fetch('http://localhost:3000/books/' + books.id, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    users: 
                    [...books.users,                    
                    {id: parseInt(userId), username: userName}
                ]
                })
            })
            .then (() => {
                const listItem = document.createElement('li');
                listItem.setAttribute("id", userName)
                listItem.textContent = userName;
                listItem.setAttribute("style", "cursor: pointer")
                userList.append(listItem);
                books.users = [...books.users,                    
                    {id: parseInt(userId), username: userName}]
            })
            .then (() => {
                likeBtn.textContent = 'Unlike';
            })
        } else if (likeBtn.textContent === 'Unlike'){
            books.users = [...books.users.filter(user => user.username !== userName)]
            console.log(books.users);
            fetch('http://localhost:3000/books/' + books.id, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    users: books.users
                })
            })
            .then (() => {
                const currentUser = userList.querySelector(`#${userName}`);
                console.log(currentUser);
                currentUser.remove();
            })
            .then (() => {
                likeBtn.textContent = 'Like';
            })
        }
        })
        
        const renderItem = document.createElement("li");
        renderItem.classList.add("sidebarBook");
        renderItem.setAttribute("style", "cursor: pointer")
        renderItem.addEventListener("click", () => {
            if (mainPanel.querySelector('img')){
                mainPanel.querySelector('.title').remove();
                mainPanel.querySelector('.subtitle').remove();
                mainPanel.querySelector('.author').remove();
                mainPanel.querySelector('img').remove();
                mainPanel.querySelector('p').remove();
                mainPanel.querySelector('.btn').remove();
                mainPanel.querySelector('.user-list').remove();
            };
            mainPanel.append(thumbnail);
            mainPanel.append(title);
            mainPanel.append(subtitle);
            mainPanel.append(author);
            mainPanel.append(description);
            mainPanel.append(likeBtn);
            mainPanel.append(userList);
            // console.log("click");
        });

        list.appendChild(renderItem).textContent = books.title;


    }

    fetch('http://localhost:3000/books')
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            data.forEach(book => {
                // console.log(book);
            renderList(book);
            })
        })

        // const test = [{id: parseInt(userId), username: userName}]
        // console.log(test);
        // const test2 = test.filter(user => user.username !== userName)
        // console.log(test2);
});


