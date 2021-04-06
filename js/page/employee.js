$(document).ready(function() {
    setEvent();
    loadData();
})

var formMode = null;
var customerIdSelected = null;

function setEvent() {

    $('#btnAdd').click(function() {
        formMode = 1;
        $('.dialog input').val(null);
        $('.dialog select').val(null);
        $('#dlgCustomerDetail').removeClass('dialog-hide');
        $('#txtCustomerCode').focus();
    });

    $(document).on('click', '.dialog-close-button', function() {
        $('#dlgCustomerDetail').addClass('dialog-hide');
    });

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
        var dateOfBirth = employee.DateOfBirth;
        var dateFormat = formatDateDDMMYYYY(dateOfBirth);

        var debitAmout = employee.Salary;
        var moneyFormat = formatMoney(debitAmout);

        var genderCode = employee.Gender;
        var Gender = formatGender(genderCode);

        var WorkStatusCode = employee.WorkStatus;
        var WorkStatus = formatWorkStatus(WorkStatusCode);

        var trHTML = $(`<tr>
                        <td>${employee.EmployeeCode}</td>
                        <td>${employee.FullName}</td>
                        <td>${Gender}</td>
                        <td>${dateFormat}</td>
                        <td>${employee.PhoneNumber}</td>
                        <td>${employee.Email}</td>
                        <td>${employee.PositionName}</td>
                        <td>${employee.DepartmentName}</td>
                        <td>${moneyFormat}</td>
                        <td>${WorkStatus}</td>
                    </tr>`);
        // debugger;
        trHTML.data('recordId', employee.EmployeeId);
        trHTML.data('record', employee);
        $('table#tblListEmployee tbody').append(trHTML);
    })
}

function btnSaveOnClick() {
    // Thu thập dữ liệu ở các input (input, select...)
    var employeeCode = $('#txtCustomerCode').val();
    var fullName = $('#txtFullName').val();
    var dob = $('#dtDateOfBirth').val();
    var gender = $('#cbGender').val();
    var cmtnd = $('#cmtnd').val()
    var ngay_cap = $('#ngay_cap').val()
    var noi_cap = $('#noi_cap').val()
    var email = $('#txtEmail').val()
    var phone_number = $('#txtPhoneNumber').val()
    var vi_tri = $('#vi_tri').val()
    var phong_ban = $('#phong_ban').val()
    var ms_thue = $('#ms_thue').val()
    var luong_co_ban = $('#luong_co_ban').val()
    var ngay_gia_nhap = $('#ngay_gia_nhap').val()
    var tinh_trang_cong_viec = $('tinh_trang_cong_viec').val()
        // Build thành object:
    var employee = {
        "EmployeeCode": employeeCode,
        "FullName": fullName,
        "DateOfBirth": dob,
        "Gender": gender,
        "IdentityNumber": cmtnd,
        "IdentityDate": ngay_cap,
        "IdentityPlace": noi_cap,
        "Email": email,
        "PhoneNumber": phone_number,
        "PositionName": vi_tri,
        "DepartmentName": phong_ban,
        "PersonalTaxCode": ms_thue,
        "Salary": luong_co_ban,
        "CreatedDate": ngay_gia_nhap,
        "WorkStatus": tinh_trang_cong_viec
    }
    var method = "POST";
    var url = "http://api.manhnv.net/v1/employees";
    if (formMode == 2) {
        employee.CustomerId = customerIdSelected;
        method = "PUT";
        url = "http://api.manhnv.net/v1/employees/" + customerIdSelected;
    }
    // debugger;
    // Gọi service POST để thực hiện cất dữ liệu:
    $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(employee),
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

function formatDateDDMMYYYY(date) {
    if (!date) {
        return "";
    }
    var newDate = new Date(date);
    var dateString = newDate.getDate();
    var monthString = newDate.getMonth() + 1;
    var year = newDate.getFullYear();
    return `${dateString}/${monthString}/${year}`;
}

function formatMoney(money) {
    const formatter = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0
    })
    if (money) {
        return formatter.format(money) // "$1,000.00"
    }
    return "";
}

function formatGender(genderCode) {
    if (genderCode === 1) {
        return "nam";
    } else if (genderCode === 0) {
        return "nữ";
    } else {
        return "Không xác định";
    }
}

function formatWorkStatus(WorkStatusCode) {
    if (WorkStatusCode === 0) {
        return "Đang thử việc";
    } else if (WorkStatusCode === 1) {
        return "Đang làm việc";
    } else if (WorkStatusCode === 2) {
        return "Đã nghỉ việc";
    } else {
        return "Đã nghỉ hưu";
    }
}