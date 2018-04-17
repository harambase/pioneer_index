let pinVue = new Vue({
    el: '#pinPage',
    data: {
        startTime: "",
        endTime: "",
        role: [],
        info: "",
        remark: "",
        table: "",
        mode: ""
    },
    mounted: function () {
        laydate.render({
            elem: '#startTime',
            theme: '#393D49',
            type: 'datetime',
            showBottom: ['clear', 'confirm'],
            done: (value) => {
                this.startTime = value
            }
        });
        laydate.render({
            elem: '#endTime',
            theme: '#393D49',
            type: 'datetime',
            showBottom: ['clear', 'confirm'],
            done: (value) => {
                this.endTime = value
            }
        });
    },
    methods: {
        generateAll: function () {
            let url = "/pin"
                + "?startTime=" + this.startTime
                + "&endTime=" + this.endTime
                + "&role=" + this.role
                + "&info=" + this.info
                + "&remark=" + this.remark;
            axios.post(url).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert(response.data.msg, function () {
                        window.location.reload();
                    });
                else {
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
                }
            });
        },
        generateOne: function () {
            let url = "/pin/" + $(".user").val()
                + "?startTime=" + this.startTime
                + "&endTime=" + this.endTime
                + "&role=" + this.role
                + "&info=" + this.info
                + "&remark=" + this.remark;
            axios.post(url).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert(response.data.msg, function () {
                        window.location.reload();
                    });
                else {
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
                }
            });
        },
        deleteAll: function () {
            Showbo.Msg.confirm("确认清除？", function () {
                if ($(".btnfocus").val() !== "取消") {
                    axios.delete('/pin/' + this.info + '/all').then(function (response) {
                        if (response.data.code === 2001)
                            Showbo.Msg.alert(response.data.msg, function () {
                                window.location.reload();
                            });
                        else {
                            Showbo.Msg.alert(response.data.msg, function () {
                            });
                        }
                    });
                }
            });

        },

    }
});

function sendAdvisorPin() {
    axios.delete('/send/advisor/' + $("#send").val()).then(function (response) {
        Showbo.Msg.alert(response.data.msg, function () {
        });
    });
}

function sendFacultyPin() {
    axios.delete('/send/faculty/' + $("#send").val()).then(function (response) {
        Showbo.Msg.alert(response.data.msg, function () {
        });
    });
}

function refresh() {
    pinTable.draw();
}

function deleteOne(pin) {
    Showbo.Msg.confirm("确认删除该识别码？", function () {
        if ($(".btnfocus").val() !== "取消") {
            axios.delete('/pin/' + pin).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert(response.data.msg, function () {
                        pinTable.draw();
                    });
                else {
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
                }
            });
        }
    });

}

let pinTable = $("#pinTable").DataTable({
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
        url: basePath + "/pin",
        data: function (d) {
            d.info = $("#info").val();
        }
    },
    columns: [
        {  //行号
            "data": null, "title": "ROW", "render": function (data, type, row, meta) {
                return meta.settings._iDisplayStart + meta.row + 1;
            }
        },
        {"data": "pin", "title": "识别码"},
        {"data": "owner", "title": "所有人"},
        {
            "data": "role", "title": "类型", "createdCell": function (nTd, rowData) {
                let html;
                if (rowData === 1) {
                    html = '<p style="line-height: 1.42857143; padding-top: 0; color:blue;">选课</p>'
                } else {
                    html = '<p style="line-height: 1.42857143; padding-top: 0; color:green;">成绩录入</p>'
                }
                $(nTd).html(html);
            }
        },
        {
            "data": null, "title": "有效时间", "createdCell": function (nTd, rowData) {
                $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:black">' + rowData.startTime + " 至 " + rowData.endTime + '</p>')
            }, "width": "500px"
        },
        {"data": "remark", "title": "备注"},
        {"data": "createTime", "title": "创建时间"},
        {
            "data": null, "title": "操作", "createdCell": function (nTd, rowData) {
                $(nTd).html('<button class="btn btn-info" onclick="deleteOne(\'' + rowData.pin + '\')">删除识别码</button>');
            }
        }
    ],
    "columnDefs": [{
        orderable: false,
        targets: [7]
    }, {
        "defaultContent": "",
        "targets": "_all"
    }]

});


//info
$(".info").select2({
    ajax: {
        url: basePath + "/pin/info",
        type: "GET",
        delay: 250,
        processResults: function (data) {
            let itemList = [];
            let item;
            for (let i = 0; i < data.data.length; i++) {
                item = {
                    id: data.data[i],
                    text: data.data[i]
                };
                itemList.push(item);
            }
            return {
                results: itemList
            };
        },
        cache: true
    },
    language: "zh-CN",
    tags: false,//允许手动添加
    allowClear: false,//允许清空
    escapeMarkup: function (markup) {
        return markup;
    }, // 自定义格式化防止xss注入
    minimumInputLength: 0,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
});

$(".user").select2({
    ajax: {
        url: basePath + "/user/search",
        type: "GET",
        delay: 250,
        data: function (params) {
            return {
                search: params.term,
                status: "1"
            };
        },
        processResults: function (data) {
            let itemList = [];
            let item;
            for (let i = 0; i < data.data.length; i++) {
                item = {
                    id: data.data[i].userId,
                    text: data.data[i].lastName + ", " + data.data[i].firstName
                };
                itemList.push(item);
            }
            return {
                results: itemList
            };
        },
        cache: true
    },
    language: "zh-CN",
    tags: false,//允许手动添加
    allowClear: false,//允许清空
    escapeMarkup: function (markup) {
        return markup;
    }, // 自定义格式化防止xss注入
    minimumInputLength: 0,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
});