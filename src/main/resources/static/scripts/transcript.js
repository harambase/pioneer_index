let transcriptVue = new Vue({
    el: "#transcriptPage",
    data: {
        transcript: {
            id: "",
            studentId: "",
            grade: "",
            crn: "",
            complete: "",
            credits: ""
        },
    },
    methods: {
        transcriptUpdate: function () {
            axios.put('/transcript/' + this.transcript.id, this.transcript).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert(response.data.msg, function () {
                        transcriptTable.draw();
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            })
        },
        transcriptReset: function () {
            this.transcript.complete = "";
            this.transcript.studentId = "";
            this.transcript.grade = "";
        }
    }
});

function refresh() {
    transcriptTable.draw();
}

function showTranscript(id, studentId, grade, complete) {
    transcriptVue.$data.transcript.id = id;
    transcriptVue.$data.transcript.studentId = studentId;
    transcriptVue.$data.transcript.grade = grade;
    transcriptVue.$data.transcript.complete = complete;
}

function downloadReport(studentId) {
    window.open(basePath + "/transcript/report?studentId=" + studentId);
}

//学生select
let userSelect = $(".user").select2({
    ajax: {
        url: basePath + "/user/search",
        type: "GET",
        delay: 250,
        data: function (params) {
            return {
                search: params.term, // search term 请求参数 ， 请求框中输入的参数
                status: "1",
                type: "s"
            };
        },
        processResults: function (data, params) {
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
                results: itemList//itemList
            };
        },
        cache: true
    },
    placeholder: '请分配所属集群',//默认文字提示
    language: "zh-CN",
    tags: false,//允许手动添加
    allowClear: true,//允许清空
    escapeMarkup: function (markup) {
        return markup;
    }, // 自定义格式化防止xss注入
    minimumInputLength: 0,//最少输入多少个字符后开始查询
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
});

//课程select
let courseSelect = $('.course').select2({
    ajax: {
        url: basePath + "/course/search",
        type: "GET",
        delay: 250,
        data: function (params) {
            return {
                search: params.term
            };
        },
        processResults: function (data, params) {
            let itemList = [];
            let item;
            for (let i = 0; i < data.data.length; i++) {
                item = {
                    id: data.data[i].crn,
                    text: data.data[i].name
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
    allowClear: true,//允许清空
    escapeMarkup: function (markup) {
        return markup;
    }, // 自定义格式化防止xss注入
    minimumInputLength: 0,//最少输入多少个字符后开始查询
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
});

//学期select
let infoSelect = $(".info").select2({
    ajax: {
        url: basePath + "/course/info",
        type: "GET",
        delay: 250,
        data: function (params) {
            return {
                search: params.term,
            };
        },
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
            item = {
                id: "",
                text: "清除"
            };
            itemList.push(item);
            return {
                results: itemList
            };
        },
        cache: true
    },
    language: "zh-CN",
    tags: false,//允许手动添加
    allowClear: true,//允许清空
    escapeMarkup: function (markup) {
        return markup;
    }, // 自定义格式化防止xss注入
    minimumInputLength: 0,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
});

let transcriptTable = $("#transcriptTable").DataTable({

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
        url: basePath + "/transcript/list",
        data: function (d) {
            d.studentId = $(".user").val();
            d.crn = $(".course").val();
            d.info = $(".info").val();
        }
    },
    columns: [
        {
            "data": null, "title": "行号", "render": function (data, type, row, meta) {
                return meta.settings._iDisplayStart + meta.row + 1;
            }
        },
        {"data": "id", "title": "序号"},
        {"data": "studentId", "title": "学生ID"},
        {"data": "sname", "title": "姓名"},
        {"data": "grade", "title": "学生成绩"},
        {
            "data": "complete", "title": "完成情况", "createdCell": function (nTd, rowData) {
                if (rowData === "1")
                    $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:green; ">完成</p>');
                else if (rowData === "0")
                    $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:blue; ">进行中</p>');
                else if (rowData === "-1")
                    $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:red; ">挂科</p>');
            }
        },
        {"data": "crn", "title": "课码"},
        {"data": "cname", "title": "课名"},
        {
            "data": null, "title": "操作", "createdCell": function (nTd, rowData) {
                $(nTd).html(
                    '<button style="width: 100%" class="btn btn-success" onclick="showTranscript(\'' + rowData.id + '\',\'' + rowData.studentId + '\',\'' + rowData.grade + '\',\'' + rowData.complete + '\')">修改成绩</button>' +
                    '<button style="width: 100%" class="btn btn-primary" onclick="downloadReport(\'' + rowData.studentId + '\')">下载成绩报告</button>'
                );
            }, "width": "100px"
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