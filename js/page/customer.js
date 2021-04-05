$(document).ready(function() {
    loadData();
})

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