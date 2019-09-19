$(document).ready(function() {
  $("#update").hide();
  $(".hide-form").hide();
  //$.fn.myFunction = function() {};
  $.ajax({
    url: "http://localhost:3004/products",
    method: "get"
  }).done(event => {
    //console.log(event)
    for (let i = 0; i < event.length; i++) {
      $("#tbody").append(
        `<tr>
              <td>${i + 1}</td>
              <td>${event[i].name}</td>
              <td>${event[i].brand}</td>
              <td>${event[i].price} </td>
              <td>${event[i].colour}</td>
              <td>${event[i].screensize}</td>
              <td>
                  <button id="edt-${
                    event[i].id
                  }" class="edit-btn btn btn-primary btn-sm">Edit</button>
                  <button id="del-${
                    event[i].id
                  }" class="delete-btn btn btn-danger btn-sm">Delete</button>
              </td>
          </tr>`
      );
    }

    $("#form").submit(event => {
      event.preventDefault();
      let name = $("#name").val();
      let brand = $("#brand").val();
      let price = parseInt($("#price").val());
      let colour = $("#colour").val();
      let screensize = $("#screensize").val();
      //alert(`${name}, ${brand}, ${price}, ${colour}, ${screensize}`)
      $.ajax({
        url: "http://localhost:3004/products",
        method: "post",
        data: {
          name,
          brand,
          price: Number(price),
          colour,
          screensize
        }
      }).done(event => {
        $("#tbody").append(
          `<tr>
              <td></td>
                  <td>
                    ${event.name}
                  </td>
                  <td>
                    ${event.brand}
                  </td>
                  <td>
                    ${event.price}
                  </td>
                  <td>
                    ${event.colour}
                  </td>
                  <td>
                    ${event.screensize}
                  </td>

              </tr>`
        );
        location.reload(true);
        $("#name").val("");
        $("#brand").val("");
        $("#price").val("");
        $("#colour").val("");
        $("#screensize").val("");
      });
    });

    $("#create").on("click", () => {
      $(".hide-form").show();
      $("#create").hide();
    });

    $("#update").on("click", event => {
      //alert(newid)
      // event.preventDefault()
      let name = $("#name").val();
      let brand = $("#brand").val();
      let price = parseInt($("#price").val());
      let colour = $("#colour").val();
      let screensize = $("#screensize").val();
      //alert(`${name}, ${brand}, ${price}, ${colour}, ${screensize}`)
      
      $.ajax({
        url: `http://localhost:3004/products/${newid}`,
        method: "patch",
        data: {
          name,
          brand,
          price: Number(price),
          colour,
          screensize

        }
      }).done(event => {
        location.reload(true);
        $("#name").val("");
        $("#brand").val("");
        $("#price").val("");
        $("#colour").val("");
        $("#screensize").val("");
      });
    });

    $(".delete-btn").on("click", event => {
      if (!confirm("Sure you want to delete this record?")) {
        return false;
      }
      let id = event.target.id.split("del-").join("");

      $.ajax({
        url: `http://localhost:3004/products/${id}`,
        method: "delete"
      }).done(event => {
        location.reload(true);
      });
    });


    $("#signin").on("click", event => {
      let username = $('#username').val();
      let password = $('#password').val();
      $.ajax({
        url:`http://localhost:3004/adminaccounts`,
        method: "get"
      }).done((event) => {
        for (let i = 0; i < event.length; i++){
          if (event[i].username == username && event[i].password == password){
            localStorage.setItem("username", username)
          }
        }
          if (window.localStorage.getItem("username") != ""){
            window.location.replace('http://localhost:3004/products.html');
          }else{
            window.location.replace('http://localhost:3004/index.html');
          }
        
      })
    })

    $(".sign-in-btn").on("click", event => {
        window.location.replace('http://localhost:3004/login.html');
      })

    $(".sign-out-btn").on("click", event => {
            localStorage.setItem("username", "")
            window.location.replace('http://localhost:3004/index.html');
      })

    $("#manage").on("click", event => {
      if (window.localStorage.getItem("username") != ""){
        window.location.replace('http://localhost:3004/products.html');
      }
      else {
        window.location.replace('http://localhost:3004/login.html');
      }
    })



    $(".edit-btn").on("click", event => {
      //alert("CALLING")
      let p = event.target.id.split("edt-").join("");
      newid = event.target.id.split("edt-").join("");
      $(".hide-form").show();
      $(window).scrollTop(0);
      $("#save").hide();
      $("#update").show();

      $.ajax({
        url: `http://localhost:3004/products`,
        method: "get"
      }).done(event => {
        for (let i = 0; i < event.length; i++) {
          if (event[i].id == p) {
            $("#name").val(`${event[i].name}`);
            $("#brand").val(`${event[i].brand}`);
            $("#price").val(`${event[i].price}`);
            $("#colour").val(`${event[i].colour}`);
            $("#screensize").val(`${event[i].screensize}`);
          }
        }
      });
    });

    $("#search").on("click", event => {
      //let p = event.target.id.split('edt-').join('')
      //newid = event.target.id.split('edt-').join('')

      $.ajax({
        url: `http://localhost:3004/products`,
        method: "get"
      }).done(event => {
        $("#tbody tr").remove();

        for (let i = 0; i < event.length; i++) {
          if (
            event[i].name == $("#search-text").val() ||
            event[i].brand == $("#search-text").val()
          ) {
            //event.preventDefault()

            //alert('hello it matched')
            $("#tbody").append(
              `<tr>
                            <td>${i + 1}</td>
                            <td>${event[i].name}</td>
                            <td>${event[i].brand}</td>
                            <td>${event[i].price} </td>
                            <td>${event[i].colour}</td>
                            <td>${event[i].screensize}</td>
                            <td>
                                <button id="edt-${event[i].id}" class="edit-btn btn btn-primary btn-sm">Edit</button>
                                <button id="del-${event[i].id}" class="delete-btn btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>`
            );

            editButtonsEventListeners();
            

            // $('#brand').val()
            // $('#price').val()
            // $('#colour').val()
            // $('#screensize').val()
          }
        } deleteButtonsEventListeners();
      });
    });
  });
}); //main scope closes

function editButtonsEventListeners() {
  $(".edit-btn").on("click", event => {
    //alert("CALL ME");
    let p = event.target.id.split('edt-').join('')
    newid = event.target.id.split('edt-').join('')
    $(".hide-form").show()
    $(window).scrollTop(0);
    $("#save").hide()
    $("#update").show()

      $.ajax({
              url:`http://localhost:3004/products`,
              method: 'get'
            })
            .done((event)=>{
              for(let i = 0; i < event.length; i++){
                  if(event[i].id == p){
                    $('#name').val(`${event[i].name}`)
                    $('#brand').val(`${event[i].brand}`)
                    $('#price').val(`${event[i].price}`)
                    $('#colour').val(`${event[i].colour}`)
                    $('#screensize').val(`${event[i].screensize}`)
                  }
              }
            })
  });
}

function deleteButtonsEventListeners(){
$(".delete-btn").on("click", event => {
  if (!confirm("Sure you want to delete this record?")) {
    return false;
  }
  let id = event.target.id.split("del-").join("");

  $.ajax({
    url: `http://localhost:3004/products/${id}`,
    method: "delete"
  }).done(event => {
    location.reload(true);
  });
});
}
