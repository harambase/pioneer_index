let creditVue = new Vue({
    el: "#creditPage",
    data: {
        student: {
            studentId: "",
            maxCredits: "",
        },
        sname: ""
    },
    methods: {
        doUpdate: function () {
            axios.put('/student/' + this.student.studentId, this.student).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert("更新成功!", function () {
                        $("#editCredits").modal('hide');
                        curStuTable.draw();
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            })
        }
    }
});

function edit(sid, sname, max_credits) {
    $("#editCredits").modal('show');
    creditVue.$data.student.studentId = sid;
    creditVue.$data.student.maxCredits = max_credits;
    creditVue.$data.sname = sname;
}

let curStuTable = $("#studentTable").DataTable({

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
        [10, 20, 50],
        [10, 20, 50]
    ],
    pageLength: 10,
    processing: true,
    serverSide: true,

    ajax: {
        url: basePath + "/student",

        data: function (d) {
            d.status = "1";
        }
    },
    columns: [
        {"data": "studentId", "title": "学生ID"},
        {"data": "sname", "title": "姓名"},
        {"data": "maxCredits", "title": "学分上限"},
        {"data": "complete", "title": "已完成学分"},
        {"data": "progress", "title": "进行中学分"},
        {"data": "incomplete", "title": "未完成学分"},
        {
            "data": null, "title": "操作", "createdCell": function (nTd, rowData) {
                $(nTd).html('<button class="btn btn-primary col-sm-12" ' +
                    'onclick="edit(\'' + rowData.studentId + '\',\'' + rowData.sname + '\',\'' + rowData.maxCredits + '\')">修改学分上限</button>');
            }, "width": "180px"
        }
    ],
    "columnDefs": [{
        orderable: false,
        targets: [6]
    }, {
        "defaultContent": "",
        "targets": "_all"
    }]
});