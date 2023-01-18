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
        likeBtn.textContent = 'Like';

        const userList = document.createElement('ul');
        userList.classList.add('user-list');
        userList.textContent = 'Liked by:';
        const bookLikers = books.users.map(user => {return user.username});
        bookLikers.forEach(user => {
            const listItem = document.createElement('li')
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
                    // ^^ Is there a better way to add the new user to the list than this? The lab said to use PATCH instead of POST, but wouldnt POST be the better option? 
                ]
                })
            })
            .then (() => {
                const listItem = document.createElement('li');
                listItem.textContent = userName;
                userList.append(listItem);
            })
            .then (() => {
                likeBtn.textContent = 'Unlike';
            })
        } else if (likeBtn.textContent === 'Unlike'){
            fetch('http://localhost:3000/books/' + books.id, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    users: 
                    [...books.users]
                    // ^^ Why does this work? Wouldn't books.users include the newest like at this point? This would only be available once the Like button was clicked, which should mean that the newest user would be part of the list.
                })
            })
            .then (() => {
                const listItem = userList.querySelectorAll('li');
                const last = listItem[listItem.length - 1]
                // ^^ This feels like cheating. I know that in this scenario the user I want to remove is the last one in the list, but what if it wasn't?
                last.remove();
            })
            .then (() => {
                likeBtn.textContent = 'Like';
            })
        }
        })
        
        const renderItem = document.createElement("li");
        renderItem.classList.add("sidebarBook");
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
            console.log("click");
        });

        list.appendChild(renderItem).textContent = books.title;

        // renderItem.addEventListener("mouseover", console.log("mouseover"));

    }

    fetch('http://localhost:3000/books')
        .then((response) => response.json())
        .then((data) => {
            data.forEach(book => {
            renderList(book);
            })
        })

});
