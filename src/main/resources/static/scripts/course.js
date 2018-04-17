let courseVue = new Vue({
    el: '#coursePage',
    data: {
        course: {
            crn: "",
            info: "",
            name: "",
            credits: "",
            level: "",
            section: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            capacity: "",
            classroom: "",
            comment: "",
            day: "",
            precrn: "",
            facultyId: "",
            courseInfo: ""
        },
        tempCourse: {
            id: "",
            crn: "",
            status: '0',
            createTime: "",
            updateTime: "",
            operatorId: "",
            facultyId: "",
            courseJson: "",
        },
        transcript: {
            id: "",
            studentId: "",
            grade: "",
            crn: "",
            complete: "",
            credits: ""
        },
        addStudent: {
            crn: "",
            studentId: "",
            credits: "",
            option: {
                prereq: false,
                time: false,
                capacity: false,
            },
        },
        courseDay: [],
        preList: [],
        table: true,
        detail: false,
        showDocument: false,
        student: false,
        confirm: false,
        pageMode: location.search.split("&")[0].split("=")[1],
        id: location.search.split("&")[1].split("=")[1],//maybe CRN
        url: location.pathname
    },
    mounted: function () {

        if (isNotEmpty(this.id)) {
            if (this.pageMode !== 'view')
                initRequest(this.id);
            else
                showCourseDetail(this.id);
        }

        //执行一个laydate实例
        laydate.render({
            elem: '#startdate',
            theme: '#393D49',
            showBottom: false,
            done: (value) => {
                this.course.startDate = value
            }
        });
        laydate.render({
            elem: '#enddate',
            theme: '#393D49',
            showBottom: false,
            done: (value) => {
                this.course.endDate = value
            }
        });
        laydate.render({
            elem: '#starttime',
            theme: '#393D49',
            type: 'time',
            min: '06:00:00',
            max: '22:00:00',
            showBottom: ['clear', 'confirm'],
            done: (value) => {
                this.course.startTime = value
            }
        });
        laydate.render({
            elem: '#endtime',
            theme: '#393D49',
            type: 'time',
            min: '06:00:00',
            max: '22:00:00',
            showBottom: ['clear', 'confirm'],
            done: (value) => {
                this.course.endTime = value
            }
        });
    },
    methods: {
        prepare: function () {
            let day = "", precrn = "";
            this.preList = $(".course").val();

            if (isNotEmpty(this.courseDay))
                for (let i = 0; i < this.courseDay.length; i++)
                    if (isNotEmpty(this.courseDay[i]))
                        day += this.courseDay[i] + "/";

            if (isNotEmpty(this.preList))
                for (let i = 0; i < this.preList.length; i++)
                    if (isNotEmpty(this.preList[i]))
                        precrn += this.preList[i] + "/";

            this.course.day = day;
            this.course.precrn = precrn;
            this.course.facultyId = $(".user").val();

            if (isNotEmpty(this.course.courseInfo))
                this.course.courseInfo = JSON.stringify(this.course.courseInfo);
        },
        showTable: function () {
            this.table = true;
            this.detail = false;
            this.student = false;
        },
        tempCourseCreate: function () {
            if(!this.confirm) {
                Showbo.Msg.alert("请确认上述信息无误!", function () {
                });
                return;
            }
            this.prepare();

            axios.post('/request/course/register', this.course).then(function (response) {
                if (response.data.code === 2001) {
                    let id = response.data.data.id;
                    Showbo.Msg.alert("申请成功，等待教务答复!", function () {
                        documentUpload(id);
                        window.location.href = basePath + '/course/request?mode=faculty';
                    });
                }
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            })
        },

        tempCourseUpdate: function () {
            if(!this.confirm) {
                Showbo.Msg.alert("请确认上述信息无误!", function () {
                });
                return;
            }

            this.prepare();

            this.tempCourse.courseJson = JSON.stringify(this.course);

            axios.put('/request/course/' + this.id, this.tempCourse).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert("修改成功，等待教务答复!", function () {
                        documentUpload();
                        window.location.href = basePath + '/course/request?mode=faculty';
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            })
        },
        tempCourseApprove: function () {
            if(!this.confirm) {
                Showbo.Msg.alert("请确认上述信息无误!", function () {
                });
                return;
            }

            this.prepare();

            this.tempCourse.status = "1";
            this.tempCourse.courseJson = JSON.stringify(this.course);

            if (!this.showDocument)
                documentUpload(this.id);
            update(this.id, this.tempCourse);

        },
        tempCourseDecline: function () {
            if(!this.confirm) {
                Showbo.Msg.alert("请确认上述信息无误!", function () {
                });
                return;
            }

            if (isNotEmpty(this.course.comment)) {
                this.tempCourse.status = "-1";
                this.tempCourse.courseJson = JSON.stringify(this.course);
                update(this.id, this.tempCourse);
            } else
                Showbo.Msg.alert("必须填写备注！", function () {
                });

        },
        courseCreate: function () {
            if(!this.confirm) {
                Showbo.Msg.alert("请确认上述信息无误!", function () {
                });
                return;
            }

            this.prepare();

            axios.post('/course', this.course).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert("创建成功!", function () {
                        courseVue.$data.course = response.data.data;
                        documentUpload(response.data.data.course.crn);
                        window.location.href = basePath + '/teach/course?mode=manage&id=';
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            })
        },
        courseUpdate: function () {
            if(!this.confirm) {
                Showbo.Msg.alert("请确认上述信息无误!", function () {
                });
                return;
            }

            this.prepare();
            axios.put('/course/' + this.course.crn, this.course).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert("修改成功!", function () {
                        documentUpload();
                        window.location.reload();
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
        },
        transcriptUpdate: function () {
            axios.put('/transcript/' + this.transcript.id, this.transcript).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert(response.data.msg, function () {
                        studentInCourse.draw();
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            })
        },
        addStudent2Course: function () {
            axios.put('/course/' + this.addStudent.crn + '/student/' + this.addStudent.studentId, this.addStudent.option).then(function (response) {
                if (response.data.code === 2001) {
                    Showbo.Msg.alert("添加成功!", function () {
                        studentInCourse.draw();
                    });
                } else {
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
                }
            });
        },
        addStudentReset: function () {
            this.addStudent.studentId = "";
            this.addStudent.option.capacity = false;
            this.addStudent.option.prereq = false;
            this.addStudent.option.time = false;
        }
    }
});

function update(id, tempCourse) {
    axios.put("/request/course/" + id, tempCourse).then(function (response) {
        if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
                window.location.href = "/teach/request?mode=manage"
            });
        else
            Showbo.Msg.alert(response.data.msg, function () {
            });
    });
}

function initCourse() {
    courseVue.$data.courseDay = courseVue.$data.course.day.split("/");
    courseVue.$data.preList = courseVue.$data.course.precrn.split("/");

    if (isNotEmpty(courseVue.$data.course.courseInfo)) {
        courseVue.$data.course.courseInfo = JSON.parse(courseVue.$data.course.courseInfo);
        courseVue.$data.showDocument = true;
    }

    let preListOption = [];
    for (let i = 0; i < courseVue.$data.preList.length; i++)
        if (courseVue.$data.preList[i] !== "")
            preListOption.push(new Option(courseVue.$data.preList[i], courseVue.$data.preList[i], true, true));
    courseSelect.append(preListOption);
    courseSelect.trigger('change');

    let facultyId = courseVue.$data.course.facultyId;
    userSelect.append(new Option(facultyId, facultyId, true, true));
    courseSelect.trigger('change');

}

function initRequest(id) {
    if (isNotEmpty(id)) {
        axios.get('/request/course/' + id).then(function (response) {
            courseVue.$data.tempCourse = response.data.data;
            courseVue.$data.course = JSON.parse(response.data.data.courseJson);
            courseVue.$data.course.facultyId = response.data.data.facultyId;
            initCourse();
        });
    }
}

function showCourseDetail(crn) {
    if (isNotEmpty(crn)) {
        axios.get('/course/' + crn).then(function (response) {
            courseVue.$data.course = response.data.data;
            initCourse();
            courseVue.$data.table = false;
            courseVue.$data.detail = true;
        });
    }
}

function showStudentDetail(crn, credits) {
    courseVue.$data.transcript.crn = crn;
    courseVue.$data.transcript.credits = credits;
    courseVue.$data.table = false;
    courseVue.$data.detail = false;
    courseVue.$data.student = true;
    studentInCourse.draw();
}

function deleteCourse(crn) {
    Showbo.Msg.confirm("确认删除该课程？", function () {
        if ($(".btnfocus").val() !== "取消") {
            axios.delete('/course/' + crn).then(function (response) {
                if (response.data.code === 2001)
                    Showbo.Msg.alert("删除成功!", function () {
                        courseTable.draw();
                    });
                else
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
            });
        }
    });
}

function documentUpload(key) {
    if (courseVue.$data.showDocument)
        return;

    if (!isNotEmpty(document.getElementById("document").files))
        return;

    let requestUrl = "/request/course/info/";
    let updateUrl = "/course/info/";
    let formData = new FormData();

    formData.append("file", document.getElementById("document").files[0]);
    let url;

    if (courseVue.$data.url.indexOf('course') !== -1 && courseVue.$data.pageMode !== 'manage') {
        if (isNotEmpty(key))
            url = requestUrl + key;
        else
            url = requestUrl + courseVue.$data.id;
    } else {
        if (isNotEmpty(key))
            url = updateUrl + key;
        else
            url = updateUrl + courseVue.$data.course.crn;
    }

    axios.put(url, formData).then(function (response) {
        if (response.data.code === 2001) {
            courseVue.$data.course.courseInfo = response.data.data;
            courseVue.$data.showDocument = true;
        } else {
            Showbo.Msg.alert(response.data.msg, function () {
            });
        }
    });
}

function refresh() {
    courseTable.draw();
}

function documentDownload() {
    if (isNotEmpty(courseVue.$data.id))//申请中的下载
        window.open(basePath + "/request/course/info/" + courseVue.$data.id);
    else {//查看下载
        window.open(basePath + "/course/info/" + courseVue.$data.course.crn);
    }
}

function removeStuFromCourse(studentId, crn) {
    Showbo.Msg.confirm("确认从课程中删除该学生？", function () {
        if ($(".btnfocus").val() !== "取消") {
            axios.delete('/course/' + crn + '/student/' + studentId).then(function (response) {
                if (response.data.code === 2001) {
                    Showbo.Msg.alert("删除成功!", function () {
                        studentInCourse.draw();
                    });
                } else {
                    Showbo.Msg.alert(response.data.msg, function () {
                    });
                }
            });
        }
    });
}

function showAddStudentToCourse(studentId) {
    courseVue.$data.addStudent.studentId = studentId;
    courseVue.$data.addStudent.crn = courseVue.$data.transcript.crn;
    courseVue.$data.addStudent.credits = courseVue.$data.transcript.credits;
}

function showTranscript(id, studentId, grade, complete) {
    courseVue.$data.transcript.id = id;
    courseVue.$data.transcript.studentId = studentId;
    courseVue.$data.transcript.grade = grade;
    courseVue.$data.transcript.complete = complete;
}

//教师select
let userSelect = $(".user").select2({
    ajax: {
        url: basePath + "/user/search",
        type: "GET",
        delay: 250,
        data: function (params) {
            return {
                search: params.term, // search term 请求参数 ， 请求框中输入的参数
                status: "1",
                type: "f"
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

//课程表
let courseTable = $("#courseTable").DataTable({

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
        "search": "模糊搜索:",
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
        [5, 10, 15, 20],
        [5, 10, 15, 20]
    ],
    pageLength: 10,
    processing: true,
    serverSide: true,

    ajax: {
        url: basePath + "/course",
        data: function (d) {
            d.info = $(".info").val();
            d.facultyId = $(".user").val();
        }
    },
    columns: [
        {
            "data": null, "title": "行号", "render": function (data, type, row, meta) {
                return meta.settings._iDisplayStart + meta.row + 1;
            }
        },
        {"data": "crn", "title": "编号"},
        {
            "data": null, "title": "课程名（等级-班级）", "createdCell": function (nTd, rowData) {
                $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:blue; ">' + rowData.name + '<br/>' + "(" + rowData.level + "-" + rowData.section + ")" + '</p>');
            }
        },
        {"data": "capacity", "title": "容量"},
        {"data": "remain", "title": "剩余"},
        {
            "data": "status", "title": "状态", "createdCell": function (nTd, rowData) {
                if (rowData === 1)
                    $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:blue; ">未开始</p>');
                else if (rowData === 0)
                    $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:green; ">进行中</p>');
                else if (rowData === -1)
                    $(nTd).html('<p style="line-height: 1.42857143; padding-top: 0; color:red; ">已结课</p>');

            }
        },
        {"data": "date", "title": "起止时间"},
        {"data": "time", "title": "上课时间"},
        {"data": "day", "title": "星期"},
        {"data": "faculty", "title": "授课老师"},
        {
            "data": null, "title": "操作", "createdCell": function (nTd, rowData) {
                $(nTd).html(
                    '<a style="cursor: pointer" onclick="showCourseDetail(\'' + rowData.crn + '\')"><i class="fa fa-search"></i>查看并编辑</a><br/>' +
                    '<a style="cursor: pointer; color: darkred" onclick="deleteCourse(\'' + rowData.crn + '\')"><i class="fa fa-trash"></i>删除该课程</a><br/>' +
                    '<a style="cursor: pointer; color: green" onclick="showStudentDetail(\'' + rowData.crn + '\',\'' + rowData.credits + '\')"><i class="fa fa-user"></i>课程学生信息</a>'
                );
                $(nTd).css({textAlign: "left"})
            }, "width": "100px"
        }
    ],
    "columnDefs": [{
        orderable: false,
        targets: [9]
    }, {
        "defaultContent": "",
        "targets": "_all"
    }]
});

//学生表
let studentTable = $("#studentTable").DataTable({
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
        [5],
        [5]
    ],
    pageLength: 5,
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
        {"data": "complete", "title": "已完成"},
        {"data": "progress", "title": "进行中"},
        {"data": "incomplete", "title": "未完成"},
        {
            "data": null, "title": "操作", "createdCell": function (nTd, rowData) {
                $(nTd).html('<button style="width: 100%" class="btn btn-success" ' +
                    'onclick="showAddStudentToCourse(\'' + rowData.studentId + '\')">查看添加条件</button>');
            }, "width": "100px"
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

let studentInCourse = $("#studentInCourse").DataTable({

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
        [5, 10, 15],
        [5, 10, 15]
    ],
    pageLength: 5,
    processing: true,
    serverSide: true,

    ajax: {
        url: basePath + "/transcript/course/student",
        data: function (d) {
            d.crn = courseVue.$data.transcript.crn;
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
        {"data": "sname", "title": "学生名"},
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
        {
            "data": null, "title": "操作", "createdCell": function (nTd, rowData) {
                $(nTd).html('' +
                    '<button style="width: 50%" class="btn btn-success" onclick="showTranscript(\'' + rowData.id + '\',\'' + rowData.studentId + '\',\'' + rowData.grade + '\',\'' + rowData.complete + '\')">修改成绩</button>' +
                    '<button style="width: 50%" class="btn btn-danger" onclick="removeStuFromCourse(\'' + rowData.studentId + '\',\'' + courseVue.$data.transcript.crn + '\')">从课程中移除</button>');
            }, "width": "200px"
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
