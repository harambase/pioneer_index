package com.harambase.pioneer.application;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin
public class WebController {

    @RequestMapping("/403")
    public String authError() {
        return "common/403";
    }

    @RequestMapping("/404")
    public String pageNotFound() {
        return "common/404";
    }

    @RequestMapping("/test")
    public String test() {
        return "test";
    }

    @RequestMapping("/index")
    public String welcome() {
        return "index_temp";
    }

    @RequestMapping("/breaking")
    public String breaking() {
        return "demo/breaking";
    }
}
