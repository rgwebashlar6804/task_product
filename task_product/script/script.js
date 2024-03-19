let productList = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
function validateForm() {
    // Get references to the form elements
    let nameInput = document.getElementById("name");
    let categoryInput = document.getElementById("category");
    let priceInput = document.getElementById("price");
    let colorInput = document.getElementById("color");
    let descriptionInput = document.getElementById("description");
    let image = document.getElementById("inputGroupFile01");

    // Get the values from the input fields and remove extra white spaces.
    let name = nameInput.value.trim();
    let category = categoryInput.value.trim();
    let price = priceInput.value.trim();
    let color = colorInput.value.trim();

    // Validate name input
    if (name === "") {
        document.getElementById("name-error-msg").innerHTML = " Please enter your name";
        return false;
    } else {
        document.getElementById("name-error-msg").innerHTML = "";
    }
    if (category === "") {
        document.getElementById("category-error-msg").innerHTML = " Please enter your Category";
        return false;
    } else {
        document.getElementById("category-error-msg").innerHTML = "";
    }

    // Validate price input
    if (price === "") {
        document.getElementById("price-error-msg").innerHTML = " Please enter the price";
        return false;
    } else {
        document.getElementById("price-error-msg").innerHTML = "";
    }


    if (isNaN(price) || price.startsWith("0")) {
        document.getElementById("price-error-msg").innerHTML = " Please enter a valid price number that not start with zero";
        return false;
    }
    else {
        document.getElementById("price-error-msg").innerHTML = "";
    }

    if (color === "") {
        document.getElementById("color-error-msg").innerHTML = " Please enter your color";
        return false;
    } else {
        document.getElementById("color-error-msg").innerHTML = "";
    }


    // Validate description input
    if (descriptionInput.value.length > 10000) {
        document.getElementById("disc-error-msg").innerHTML = " Description can be maximum 50 characters";
        return false;
    } else if (descriptionInput.value == "") {
        document.getElementById("disc-error-msg").innerHTML = " Please enter the Discription";
        return false;
    } else {
        document.getElementById("disc-error-msg").innerHTML = "";
    }

    // Validate image input
    if (image.files.length === 0) {
        document.getElementById("image-error-msg").innerHTML = " Please attach an image";
        return false;
    } else {
        document.getElementById("image-error-msg").innerHTML = ""
    }

    // regular expression for image format
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(image.files[0].name)) {
        document.getElementById("image-error-msg").innerHTML = " Please attach a valid image file (jpg, jpeg, png, or gif)";
        image.value = "";
        return false;
    } else {
        document.getElementById("image-error-msg").innerHTML = ""
    }

    // Check the file size of the uploaded image
    let fileSize = image.files[0].size / 1024; // in KB
    if (fileSize > 1024) {
        document.getElementById("image-error-msg").innerHTML = " Please attach an image that is smaller than 1024KB";
        image.value = "";
        return false;
    }
    else {
        document.getElementById("image-error-msg").innerHTML = "";
    }
    return true;
}
//show data
function showData() {
    cart(productList);
}


// Load all data when document or page load
showData();

//add data
function AddData() {
    if (validateForm() == true) {
        let name = document.getElementById("name").value;
        let category = document.getElementById("category").value;
        let price = document.getElementById("price").value;
        let color = document.getElementById("color").value;
        let description = document.getElementById("description").value;
        let image = document.getElementById("inputGroupFile01");
        let reader = new FileReader();

        // let productList = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];

        // generate new ID by incrementing the highest existing ID
        let id = 1;
        if (productList.length > 0) {
            let ids = productList.map((product) => product.id);
            id = Math.max(...ids) + 1;
        }
        reader.readAsDataURL(image.files[0]);
        reader.addEventListener("load", () => {
            productList.push({
                id: id,
                name: name,
                category: category,
                description: description,
                price: price,
                color: color,
                image: reader.result,
            });
            localStorage.setItem("productList", JSON.stringify(productList));
            location.reload();
            showData();
        });

        document.getElementById("name").value = "";
        document.getElementById("category").value = "";
        document.getElementById("price").value = "";
        document.getElementById("color").value = "";
        document.getElementById("description").value = "";
        document.getElementById("inputGroupFile01").value = "";
        document.getElementById("close-btn").click();
        alert("Data Added Successfully");



        //reset form

        // Reset form and validator on modal hide
        $('#addDataModal').on('hidden.bs.modal', function () {
            $("#myform")[0].reset();
            $("#myform").validateForm().resetForm();
        });
    }
}

//delete data
function deleteData(id) {
    // let productList = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    const index = productList.findIndex(product => product.id == id)
    console.log("index " + index);

    // Display a confirmation message to the user
    if (confirm("Are you sure you want to delete this item?")) {
        productList.splice(index, 1);
        localStorage.setItem("productList", JSON.stringify(productList));
        showData();
        location.reload(); // Reload the current page
    }
}

//edit data
function editData(id) {

    // let productList = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];

    console.log(id)
    if (productList && productList.length > 0) { }
    const index = productList?.findIndex(product => product.id == id)
    console.log("index " + index);

    document.getElementById("id-edit").value = productList[index].id;
    document.getElementById("name-edit").value = productList[index].name;
    document.getElementById("category-edit").value = productList[index].category;
    document.getElementById("price-edit").value = productList[index].price;
    document.getElementById("color-edit").value = productList[index].color;
    document.getElementById("description-edit").value = productList[index].description;

    let imagePreview = document.getElementById("image-div");
    imagePreview.src = productList[index].image;
    document.getElementById("image-div").innerHTML =
        "<img src=" + productList[index].image + " width='100%' height='100%'>";
    //image edit
    let imageEdit = document.getElementById("image-edit");
    imageEdit.onchange = function (event) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function () {
            productList[index].image = reader.result;
            imagePreview.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    document.querySelector("#update").onclick = function () {
        productList[index].id = document.getElementById("id-edit").value;
        productList[index].name = document.getElementById("name-edit").value;
        productList[index].category = document.getElementById("category-edit").value;
        productList[index].price = document.getElementById("price-edit").value;
        productList[index].color = document.getElementById("color-edit").value;
        productList[index].description = document.getElementById("description-edit").value;
        localStorage.setItem("productList", JSON.stringify(productList));
        location.reload();

        showData();
        document.getElementById("id-edit").value = "";
        document.getElementById("name-edit").value = "";
        document.getElementById("category-edit").value = "";
        document.getElementById("price-edit").value = "";
        document.getElementById("color-edit").value = "";
        document.getElementById("description-edit").value = "";
        document.getElementById("close-btn").click();
        alert("Data Updated Successfully");
    };
}

//searchbar
function searchBar() {
    let searchvalue = document.querySelector("#serachProductText").value;
    console.log(searchvalue);
    let sortedItem = [];
    let sortedProduct =  JSON.parse(localStorage.getItem("productList")) ?? [];
    let regex = new RegExp(searchvalue, "i");
    for (let element of sortedProduct) {
        let item = element;
        if (regex.test(item.name)) {
            sortedItem.push(element);
        }
    }
    console.log(sortedItem);
    searchProduct(sortedItem);
}
//category serachbox
function searchBar1() {
    let searchvalue = document.querySelector("#serachProductcategory").value;
    console.log(searchvalue);
    let sortedItem = [];
    let sortedProduct = JSON.parse(localStorage.getItem("productList")) ?? [];
    let regex = new RegExp(searchvalue, "i");
    for (let element of sortedProduct) {
        let item = element;
        if (regex.test(item.category)) {
            sortedItem.push(element);
        }
    }
    console.log(sortedItem);
    searchProduct(sortedItem);
}

function searchBar2() {
    let searchvalue = document.querySelector("#serachProductcolor").value;
    console.log(searchvalue);
    let sortedItem = [];
    let sortedProduct = JSON.parse(localStorage.getItem("productList")) ?? [];
    let regex = new RegExp(searchvalue, "i");
    for (let element of sortedProduct) {
        let item = element;
        if (regex.test(item.color)) {
            sortedItem.push(element);
        }
    }
    console.log(sortedItem);
    searchProduct(sortedItem);
}

//search product
function searchProduct(sortedItem) {
    cart(sortedItem);
}


let selectElem = document.querySelector("#sort-select");
selectElem.addEventListener("change", (event) => {
    let sortBy = event.target.value;
    filterProduct(sortBy);
    if (sortBy == "refresh-btn") {
        location.reload();
    }
});



function filterProduct(sortvalue) {
    console.log(sortvalue);
    let productList = JSON.parse(localStorage.getItem("productList")) ?? [];
    let sortedProduct = JSON.parse(localStorage.getItem("sortedProduct")) ?? [];
    sortedProduct = productList;
    console.log(sortedProduct)
    localStorage.setItem("sortedProduct", JSON.stringify(sortedProduct));
    //filter Description    
    if (sortvalue == "desc") {
        let desc = true;
        sortedProduct = sortedProduct.sort((a, b) =>
            desc ? b.id - a.id : a.id - b.id
        );
        desc = !desc;
        console.log("descending", sortedProduct);
        return filteredData(sortedProduct);
    }
    else if (sortvalue == "asc") {
        let desc = false;
        sortedProduct = sortedProduct.sort((a, b) =>
            desc ? b.id - a.id : a.id - b.id
        );
        console.log("Asc", sortedProduct);
        return filteredData(sortedProduct);
    } else if (sortvalue == "name") {
        sortedProduct = sortedProduct.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        console.log("name", sortedProduct);
        return filteredData(sortedProduct);
    } else if (sortvalue == "name-desc") {
        sortedProduct = sortedProduct.sort((a, b) =>
            b.name.localeCompare(a.name)
        );
        console.log("name", sortedProduct);
        return filteredData(sortedProduct);
    }
    else if (sortvalue == "color") {
        sortedProduct = sortedProduct.sort((a, b) =>
            a.color.localeCompare(b.color)
        );
        console.log("color", sortedProduct);
        return filteredData(sortedProduct);
    } else if (sortvalue == "color-desc") {
        sortedProduct = sortedProduct.sort((a, b) =>
            b.color.localeCompare(a.color)
        );
        console.log("color", sortedProduct);
        return filteredData(sortedProduct);
    }
    else if (sortvalue == "category") {
        sortedProduct = sortedProduct.sort((a, b) =>
            a.category.localeCompare(b.category)
        );
        console.log("category", sortedProduct);
        return filteredData(sortedProduct);
    } else if (sortvalue == "price-desc") {
        sortedProduct = sortedProduct.sort((a, b) => a.price - b.price);
        console.log("Price", sortedProduct);
        return filteredData(sortedProduct);
    } else if (sortvalue == "price") {
        sortedProduct = sortedProduct.sort((a, b) => b.price - a.price);
        console.log("Price", sortedProduct);
        return filteredData(sortedProduct);
    } else {
        return false;
    }
}

//filter data
function filteredData(sortedProduct) {
    cart(sortedProduct);
}





//category filer add
function filterCategories() {
    let checked = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(checked).map(checkbox => checkbox.value);
    // console.log(selectedCategories);
    // console.log(filteredProducts);
    if (selectedCategories.length === 0) {
        displayCategories(productList);
    } else {
        const filteredProducts = productList.filter(product => selectedCategories.includes(product.category));
        displayCategories(filteredProducts);
    }

}

function displayCategories(productList) {  

    cart(productList);

}



function cart(productList) {
    let html = "";
    // console.log("filterData", productList);
    if (productList.length === 0) {
        html += `<div class="card-body">
        <div class="row gx-2">
          <div class="col">
            <div class="p-3">
              <img src="img/no-data-found.png" class="img-fluid rounded mx-auto d-block" alt="No Products">
              <p class="text-center">No products to display</p>
            </div>
          </div>
        </div>
      </div>`;
    } else {
        productList.forEach(function (element) {
            // Truncate description to two lines initially
            let truncatedDescription = element.description.split('\n').slice(0, 1).join('\n');
            let reminingDescriptions = element.description.split('\n').slice(1,).join('\n');

            html +=
                `<div>
        <div class='row gx-2'>
        <div class='col'>
        <div class='p-3'>
        <div class='card d-flex card-all'>
        <div class='card-body'style=" height: 11rem; width: 16rem;">
        <h5 class='card-title text-center'><strong>Product Id.-</strong> ${element.id} </h5>
        <img src="${element.image}" class="card-img-top" alt='Image' style=" height: 7rem; width: 14rem;">
        </div>
        <ul class='list-group list-group-flush'>
        <li class='list-group-item'><strong>Product -</strong>  ${element.name}  </li>
        <li class='list-group-item'><strong>category -</strong>  ${element.category}  </li>
        <li class='list-group-item h-25 description'><strong>Description -</strong>  ${truncatedDescription}  <span class="more" style="display: none">${reminingDescriptions}</span> <button class="btn btn-link view-more">View More</button></li>
        <li class='list-group-item'><strong> Price -</strong>  ₹ ${element.price}</li>
        <li class='list-group-item'><strong> Color -</strong>  ${element.color}</li>
        </ul>
        <div class='card-body text-center'>
         <button onclick='editData("${element.id}")' type='button' data-bs-toggle='modal' data-bs-target='#exampleModal-2' class='btn btn-success' style="width: 49%">Edit</button>
         <button onclick='deleteData("${element.id}")' type='button' class='btn btn-danger' style="width: 49%">Delete</button>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>`;
        });
    }
    document.querySelector("#curd-table").classList.add("d-none");
    document.querySelector("#sort-table").innerHTML = html;


    // Add event listeners for "View More" buttons
    document.querySelectorAll('.view-more').forEach(button => {
        button.addEventListener('click', () => {
            let descriptionSpan = button.parentNode.querySelector('.more');
            if (descriptionSpan.style.display === 'none') {
                descriptionSpan.style.display = 'inline';
                button.innerText = 'View Less';
            } else {
                descriptionSpan.style.display = 'none';
                button.innerText = 'View More';
            }
        });
    });
}