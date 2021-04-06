$(document).ready(function() {
    setEvent();
    loadData();
})

var formMode = null;

function setEvent() {

    $('#btnAdd').click(function() {
        formMode = 1;
        $('.dialog input').val(null);
        $('.dialog select').val(null);
        $('#dlgCustomerDetail').removeClass('dialog-hide');
    })

    $(document).on('click', '.dialog-close-button', function() {
        $('#dlgCustomerDetail').addClass('dialog-hide');
    })

    $('#btnSave').click(btnSaveOnClick);
}

function loadData() {
    $('#tblListEmployee tbody').empty()
    var data = getData();
    console.table(data);
    buildDataTableHTML(data);
}

function getData() {
    var employees = null;
    $.ajax({
        method: "GET",
        url: "http://api.manhnv.net/v1/employees",
        data: null,
        async: false,
        contentType: "application/json"
    }).done(function(response) {
        employees = response;
    }).fail(function(response) {
        alert("ko lay duoc du lieu")
    })
    return employees;
}

function buildDataTableHTML(data) {
    $.each(data, function(index, employee) {
        // debugger;
        var trHTML = $(`<tr>
                        <td>${employee.EmployeeCode}</td>
                        <td>${employee.FullName}</td>
                        <td>${employee.Gender}</td>
                        <td>${employee.DateOfBirth}</td>
                        <td>${employee.PhoneNumber}</td>
                        <td>${employee.Email}</td>
                        <td>${employee.PositionName}</td>
                        <td>${employee.DepartmentName}</td>
                        <td>${employee.Salary}</td>
                        <td>${employee.WorkStatus}</td>
                    </tr>`);
        // debugger;
        trHTML.data('recordId', employee.EmployeeId);
        trHTML.data('record', employee);
        $('table#tblListEmployee tbody').append(trHTML);
    })
}

function btnSaveOnClick() {
    // Thu thập dữ liệu ở các input (input, select...)
    var customerCode = $('#txtCustomerCode').val();
    var fullName = $('#txtFullName').val();
    var customerGroupId = $('#cbCustomerGroup').val();
    var gender = $('#cbGender').val();
    var dob = $('#dtDateOfBirth').val();
    var phone = $('#txtPhoneNumber').val();
    var email = $('#txtEmail').val();
    // Build thành object:
    var customer = {
        "CustomerCode": customerCode,
        "FullName": fullName,
        "Gender": gender,
        "DateOfBirth": dob,
        "Email": email,
        "PhoneNumber": phone
    }
    var method = "POST";
    var url = "http://api.manhnv.net/api/customers";
    if (formMode == 2) {
        customer.CustomerId = customerIdSelected;
        method = "PUT";
        url = "http://api.manhnv.net/api/customers/" + customerIdSelected;
    }
    debugger;
    // Gọi service POST để thực hiện cất dữ liệu:
    $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(customer),
        contentType: 'application/json'
    }).done(function(res) {
        if (formMode == 1) {
            alert('Thêm mới thành công!');
        } else {
            alert('Sửa thành công!');
        }

        $('#dlgCustomerDetail').addClass('dialog-hide');
        // load lại dữ liệu
        loadData();

    }).fail(function(res) {
        console.log(res);
        alert(res.responseText);
    })
}