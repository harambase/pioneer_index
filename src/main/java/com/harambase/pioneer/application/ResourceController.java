package com.harambase.pioneer.application;

import com.harambase.pioneer.common.Config;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Controller
@CrossOrigin
public class ResourceController extends WebMvcConfigurerAdapter {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/static/styles/**").addResourceLocations("classpath:/static/styles/");
        registry.addResourceHandler("/static/fonts/**").addResourceLocations("classpath:/static/fonts/");
        registry.addResourceHandler("/static/scripts/**").addResourceLocations("classpath:/static/scripts/");
        registry.addResourceHandler("/static/plugins/**").addResourceLocations("classpath:/static/plugins/");
        registry.addResourceHandler("/static/images/**").addResourceLocations("classpath:/static/images/");
        registry.addResourceHandler("/static/data/**").addResourceLocations("classpath:/static/data/");
        registry.addResourceHandler("/pioneer/**").addResourceLocations("file:" + Config.TEMP_FILE_PATH + "/image");

        super.addResourceHandlers(registry);
    }
}
