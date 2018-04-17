let userTable;
let userVue = new Vue({
    el: '#userPage',
    data: {
        userList: [],
        user: {
            userId: "",
            createTime: "",
            updateTime: "",
            status: "",
            userInfo: "",
            roleId: "",
            type: "",
            info: "",
            lastName: "",
            firstName: "",
            email: "",
            password: "",
            weChat: "",
            qq: "",
            tel: "",
            birthday: "",
            gender: "",
            comment: "",
            profile: "",
            address: ""
        },
        userType: [],
        userRole: [],
        passwordReset: "",
        showDocument: false,
        showProfile: false,
        table: true,
        detail: false,
        pageMode: location.search.split("&")[0].split("=")[1],//location.search获取url中的?后的字符串
    },
    created: function () {
        if (this.pageMode !== 'create' && this.pageMode !== 'profile' && this.pageMode !== 'view') {
            window.location.href = basePath + "/404";
        }
    },
    mounted: function () {
        laydate.render({
            elem: '#birthday',
            theme: '#393D49',
            showBottom: false,
            done: (value) => {
                this.user.birthday = value
            }
        });
    },
    methods: {

        showUserTable: function () {
            this.table = true;
            this.detail = false;
            this.showDocument = false;
            this.showProfile = false;
        },

        update: function () {
            let type = "";
            let roleId = "";
            for (let i = 0; i < this.userType.length; i++)
                if (this.userType[i] !== "")
                    type += this.userType[i] + "/";
            for (let i = 0; i < this.userRole.length; i++)
                if (this.userRole[i] !== "")
                    roleId += this.userRole[i] + "/";

            if (type.indexOf("s") !== -1)
                roleId += "5/";
            if (type.indexOf("f") !== -1)
                roleId += "6/7/";

            this.user.type = type;
            this.user.roleId = roleId;

            if (this.passwordReset) {
                this.user.password = hex_md5("pioneer123456");
            }

            this.user.profile = JSON.stringify(this.user.profile);
            this.user.userInfo = JSON.stringify(this.user.userInfo);

            axios.put("/user/" + this.user.userId, this.user).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert(response.data.msg, function () {
                        window.location.href = basePath + "/system/user/manage?mode=view";
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            });
        },

        create: function () {
            let type = "";
            let roleId = "";
            for (let i = 0; i < this.userType.length; i++)
                if (this.userType[i] !== "")
                    type += this.userType[i] + "/";
            for (let i = 0; i < this.userRole.length; i++)
                if (this.userRole[i] !== "")
                    roleId += this.userRole[i] + "/";

            if (type.indexOf("s") !== -1)
                roleId += "5/";
            if (type.indexOf("f") !== -1)
                roleId += "6/7/";

            this.user.type = type;
            this.user.roleId = roleId;
            this.user.password = hex_md5(this.user.password);

            axios.post("/user", this.user).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert(response.data.msg, function () {
                        window.location.href = basePath + "/system/user/manage?mode=view";
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            });
        }
    }
});

function documentUpload() {
    let formData = new FormData();
    formData.append("file", document.getElementById("document").files[0]);
    if (formData !== null && formData !== undefined) {
        axios.put("/user/info/" + userVue.$data.user.userId, formData).then(function (response) {
            if (response.data.code === 2001) {
                Showbo.Msg.alert(response.data.msg, function () {
                    userVue.$data.user.userInfo = response.data.data;
                    userVue.$data.showDocument = true;
                });
            } else {
                Showbo.Msg.alert(response.data.msg, function () {
                });
            }
        });
    }
}

function documentDownload() {
    window.open(basePath + "/user/info/" + userVue.$data.user.userId);
}

function previewImg() {

    let preview = document.getElementById("preview");
    let file = document.querySelector("input[type=file]").files[0];
    let reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
    }

    reader.onloadend = function () {
        preview.src = reader.result;
    }

}

function profileUpload() {
    let formData = new FormData();
    formData.append("file", document.getElementById("profile").files[0]);
    if (formData !== null && formData !== undefined) {
        axios.put("/user/profile/" + userVue.$data.user.userId, formData).then(function (response) {
            if (response.data.code === 2001) {
                Showbo.Msg.alert(response.data.msg, function () {
                    userVue.$data.user.profile = response.data.data;
                    userVue.$data.showProfile = true;
                    let file = document.querySelector("input[type=file]").files[0];
                    let current = document.getElementById("current");
                    let reader = new FileReader();
                    if (file) {
                        reader.readAsDataURL(file);
                    } else {
                        current.src = '';
                    }

                    reader.onloadend = function () {
                        current.src = reader.result;
                    };
                });
            } else {
                Showbo.Msg.alert(response.data.msg, function () {
                });
            }
        });
    }
}

function deleteUser(userId) {
    Showbo.Msg.confirm("确认删除该用户？", function () {
        if ($(".btnfocus").val() !== "取消") {
            axios.delete("/user/" + userId).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert("删除成功!", function () {
                        userTable.draw();
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            });
        }
    });
}

function userDetail(col) {
    userVue.$data.user = userVue.$data.userList[col];
    setInfo();
    userVue.$data.table = false;
    userVue.$data.detail = true;
}

function setInfo() {
    userVue.$data.userType = userVue.$data.user.type.split("/");
    userVue.$data.userRole = userVue.$data.user.roleId.split("/");

    if (isNotEmpty(userVue.$data.user.profile)) {
        userVue.$data.user.profile = JSON.parse(userVue.$data.user.profile);
        userVue.$data.showProfile = true;
    }

    if (isNotEmpty(userVue.$data.user.userInfo)) {
        userVue.$data.user.userInfo = JSON.parse(userVue.$data.user.userInfo);
        userVue.$data.showDocument = true;
    }
}

$(function () {

    if (userVue.$data.pageMode === 'profile') {
        axios.get('/user/current').then(function (response) {
            userVue.$data.user = response.data.data;
            setInfo();
        });
    }

    userTable = $("#userTable").DataTable({
        "language": {
            "aria": {
                "sortAscending": ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            },
            "emptyTable": "没有数据！",
            "info": "显示 _START_ 至 _END_ 条 ，总共_TOTAL_ 条数据",
            "infoEmpty": "没有发现记录！",
            "infoFiltered": "(从_MAX_条记录中搜索)",
            "lengthMenu": "显示: _MENU_",
            "search": "搜索:",
            "zeroRecords": "没有找到匹配的记录！",
            "paginate": {
                "previous": "上一页",
                "next": "下一页",
                "last": "尾页",
                "first": "首页"
            }
        },
        "pagingType": "full_numbers",
        "lengthMenu": [
            [5, 10, 50],
            [5, 10, 50]
        ],
        pageLength: 10,
        processing: true,
        serverSide: true,

        ajax: {
            url: basePath + "/user",
        },
        columns: [
            {  //行号
                "data": null, "title": "ROW", "render": function (data, type, row, meta) {
                    return meta.settings._iDisplayStart + meta.row + 1;
                }
            },
            {"data": "userId", "title": "用户ID"},
            {"data": "username", "title": "用户名"},
            {"data": "lastName", "title": "姓"},
            {"data": "firstName", "title": "名"},
            {"data": "type", "title": "账户类型"},
            {
                "data": "status", "title": "状态", "createdCell": function (nTd, rowData, row) {
                    if (rowData === "1") $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:green;">已启用</p>');
                    else if (rowData === "0") $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:red; ">已禁用</p>');
                    userVue.$data.userList.push(row);
                }
            },
            {"data": "updateTime", "title": "更新时间"},
            {
                "data": null, "title": "操作", "createdCell": function (nTd, rowData, row, col) {
                    $(nTd).html('<button class="btn btn-info" onclick="deleteUser(\'' + rowData.userId + '\')">删除用户</button>' +
                        '<button class="btn btn-edit" onclick="userDetail(\'' + col + '\')">编辑用户</button>');
                }, "width": "180px"
            }
        ],
        "columnDefs": [{
            orderable: false,
            targets: [8]
        }, {
            "defaultContent": "",
            "targets": "_all"
        }]

    });
});