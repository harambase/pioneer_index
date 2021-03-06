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

    @RequestMapping({"/index","/"})
    public String welcome() {
        return "index";
    }

    @RequestMapping("/breaking")
    public String breaking() {
        return "demo/breaking";
    }

    @RequestMapping("/contact")
    public String contact() {
        return "demo/contact";
    }

    @RequestMapping("/about")
    public String about() { return "about"; }

    @RequestMapping("/graduate")
    public String graduate() { return "graduate"; }

    @RequestMapping("/news")
    public String news() { return "news"; }

    @RequestMapping("/lessons")
    public String lessons() { return "lessons"; }

    @RequestMapping("/tupian")
    public String tupian() { return "tupian"; }

    @RequestMapping("/aboutReports1")
    public String aboutReports1() { return "aboutReports1"; }

    @RequestMapping("/aboutReports2")
    public String aboutReports2() { return "aboutReports2"; }

    @RequestMapping("/aboutReports3")
    public String aboutReports3() { return "aboutReports3"; }

    @RequestMapping("/activity")
    public String activity() { return "activity"; }

    @RequestMapping("/news2")
    public String news2() { return "news2"; }

    @RequestMapping("/news0")
    public String news0() { return "news0"; }
}
