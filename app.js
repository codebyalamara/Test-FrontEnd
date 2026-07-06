const blogForm = document.getElementById('blogForm')
const titleControl = document.getElementById('title')
const contentControl = document.getElementById('content')
const blogContainer = document.getElementById('blogContainer')
const addBlogBtn = document.getElementById('addBlogBtn')
const updateBlogBtn = document.getElementById('updateBlogBtn')

const BASE_URL = 'https://blog-task-backend-server-b5rm.onrender.com'

const BASE_URL = 'http://localhost:3000'
let blogsArray = []

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 2000,
        showConfirmButton: false
    })
}

function createBlogCards(arr) {
    blogContainer.innerHTML = ''

    arr.forEach(blog => {
        let blogCard = document.createElement('div')
        blogCard.id = blog.id

        blogCard.classList.add('col-md-3', 'mb-4', 'blog-card')

        blogCard.innerHTML = `
            <div class="card h-100">
                <div class="card-header">
                    <h2>${blog.title}</h2>
                </div>

                <div class="card-body">
                    <p>${blog.content}</p>
                </div>

                <div class="card-footer d-flex justify-content-between">
                    <button
                        onclick="editBlog('${blog.id}')"
                        class="btn btn-primary edit-btn"
                        data-id="${blog.id}">
                        Edit
                    </button>

                    <button
                        onclick="deleteBlog('${blog.id}')"
                        class="btn btn-danger delete-btn"
                        data-id="${blog.id}">
                        Delete
                    </button>
                </div>
            </div>
        `

        blogContainer.appendChild(blogCard)
    })
}

fetch(`${BASE_URL}/blogs`)
    .then(response => response.json())
    .then(res => {
        blogsArray = res.data
        createBlogCards(blogsArray)
    })
    .catch(err => {
        console.log(err)
    })

blogForm.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!titleControl.value.trim() || !contentControl.value.trim()) {
    snackbar('Title and Content are required !!!', 'warning')
    return
}

    let blog = {
        title: titleControl.value,
        content: contentControl.value
    }

    fetch(`${BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)

        blogsArray.unshift(data.data)
        createBlogCards(blogsArray)

        blogForm.reset()
        snackbar('Blog added successfully !!!', 'success')
    })
    .catch(err => {
        console.log(err)
    })
})

function editBlog(id) {
    localStorage.setItem('EDIT_ID', id)

    let getBlog = blogsArray.find(blog => blog.id === id)

    titleControl.value = getBlog.title
    contentControl.value = getBlog.content

    addBlogBtn.classList.add('d-none')
    updateBlogBtn.classList.remove('d-none')

    window.scrollTo({
    top: 0,
    behavior: 'smooth'
})
}

updateBlogBtn.addEventListener('click', (event) => {
    event.preventDefault()

    if (!titleControl.value.trim() || !contentControl.value.trim()) {
    snackbar('Title and Content are required !!!', 'warning')
    return
}

    let UPDATED_ID = localStorage.getItem('EDIT_ID')

    let UPDATE_BLOG = {
        title: titleControl.value,
        content: contentControl.value
    }

    fetch(`${BASE_URL}/blogs/${UPDATED_ID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(UPDATE_BLOG)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)

        let getIndex = blogsArray.findIndex(blog => blog.id === UPDATED_ID)
        blogsArray[getIndex] = data.data

        createBlogCards(blogsArray)

        blogForm.reset()
        localStorage.removeItem('EDIT_ID')

        updateBlogBtn.classList.add('d-none')
        addBlogBtn.classList.remove('d-none')

        snackbar('Blog updated successfully !!!', 'success')

        window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
    })
    .catch(err => {
        console.log(err)
    })
})

//
function deleteBlog(id) {

    Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this blog?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel'
    }).then((result) => {

        if (result.isConfirmed) {

            fetch(`${BASE_URL}/blogs/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {

                console.log(data)

                blogsArray = blogsArray.filter(blog => blog.id !== id)

                createBlogCards(blogsArray)

                snackbar('Blog deleted successfully !!!', 'success')

            })
            .catch(err => {
                console.log(err)
            })

        }

    })

}