package com.yatish.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleUser {
	    private String email;
	    private String name;
	    private String image;
	    private String provider;
	    private String providerId;
}
