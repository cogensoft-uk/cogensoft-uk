var SCREENSIZE = null;
var SCREEN_SIZE_TYPES = {'xs':0, 'ti':1, 'tism': 2, 'sm':3, 'md':4, 'lg':5, 'xl':6};

var HEADER_ICONS = {
    companies: [
        {type: 'top', text: 'Orders', icon: 'shopping-cart'},
        {type: 'middle', text: 'Inventory', icon: 'newspaper'},
        {type: 'bottom', text: 'Marketing', icon: 'thumbs-up'}
    ],
    customers: [
        {type: 'top', text: 'Products', icon: 'shopping-cart'},
        {type: 'middle', text: 'Payment Providers', icon: 'credit-card'},
        {type: 'bottom', text: 'Booking Engines', icon: 'calendar-alt'}
    ],
    people: [
        {type: 'top', text: 'Information', icon: 'info'},
        {type: 'middle', text: 'Events', icon: 'calendar'},
        {type: 'bottom', text: 'Social Media', icon: 'share'}
    ],
    suppliers: [
        {type: 'top', text: 'Inventory', icon: 'newspaper'},
        {type: 'middle', text: 'Order Management', icon: 'shopping-cart'},
        {type: 'bottom', text: 'Accounting Tools', icon: 'calculator'}
    ],
    employees: [
        {type: 'top', text: 'Order Processing', icon: 'dolly'},
        {type: 'middle', text: 'Product Settings', icon: 'wrench'},
        {type: 'bottom', text: 'Sales Data', icon: 'chart-line'}
    ]
};

$(function() {
    loadScripts();
});

function init() {
    //Respond to screen size changes
    $(window).resize(function() {
        getScreenSize();
        setHeaderIconImage();
        updateNav();
    });
    getScreenSize();
    setHeaderIconImage();
    $('header .flex-grid').removeClass('hidden');

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

    //Update nav highlighting on scroll
    $('body').scrollspy({
        offset: 150,
        target: '.navbar-fixed-top'
    }).on("activate.bs.scrollspy", function(){
        updateNav();
    });
    updateNav();

    //Mobile collapsible nav
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    //Handle modal popups
    $('div.modal').on('show.bs.modal', function() {
        var modal = this;
        var hash = modal.id;
        window.location.hash = hash;
        window.onhashchange = function() {
            if (!location.hash){
                $(modal).modal('hide');
            }
        }
    });

    //Contact Form
    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "././mail/contact_me.php",
                type: "POST",
                data: {
                    name: name,
                    phone: phone,
                    email: email,
                    message: message
                },
                cache: false,
                success: function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Your message has been sent. </strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function() {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                }
            });
        },
        filter: function() {
            return $(this).is(":visible");
        }
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });

    /*When clicking on Full hide fail/success boxes */
    $('#name').focus(function() {
        $('#success').html('');
    });

    //Carousel
    var $carousel = $('.carousel');
    var $connectingText = $('.connecting-text');
    if($carousel.length > 0) carousel.init($carousel);
    $carousel.on('beforeTransition', function() {
        $('.header-center-image').attr('src', '/img/header/cogensoft-'+SCREENSIZE.slice(-1)[0]+'-passive.png');
        $('header .last .header-icon').addClass('inactive');
        $('header .block.first .header-icon.active .icon-text').removeClass('add-background');
        $connectingText.find('.connecting-dots').addClass('invisible').removeClass('hidden');
        $connectingText.find('.passive-text').addClass('hidden');
        $connectingText.find('.active-text').removeClass('hidden');
    });
    $carousel.on('duringTransition', function() {
        $('.header-center-image').attr('src', '/img/header/cogensoft-'+SCREENSIZE.slice(-1)[0]+'-transition.png');
        $('header .block.first .header-icon.active .icon-text').addClass('add-background');
        $connectingText.find('.connecting-dots:first').removeClass('invisible');
    });
    $carousel.on('afterTransition', function() {
        $('.header-center-image').attr('src', '/img/header/cogensoft-'+SCREENSIZE.slice(-1)[0]+'-active.png');
        setIcons($('header .first .header-icon.carousel-panel.active').attr('data-type'));
        $connectingText.find('.connecting-dots').addClass('hidden');
        $connectingText.find('.active-text').addClass('hidden');
        $connectingText.find('.passive-text').removeClass('hidden');
    });
    $carousel.on('complete', function() {
        $connectingText.find('.passive-text').addClass('hidden');
    });
}

function loadScripts() {
    $.getScript("/js/bootstrap.min.js", function() {
        $.getScript("/js/jquery.easing.min.js", function() {
            $.getScript("/js/jquery.transit.min.js", function() {
                $.getScript("/js/jqBootstrapValidation.min.js", function() {
                    init();
                });
            });
        });
    });
}

function getScreenSize() {
    var width = $(document).width();
    SCREENSIZE = ['xs'];

    if(width > 374) {
        SCREENSIZE.push('ti');
    }
    if(width > 409) {
        SCREENSIZE.push('tism');
    }
    if(width > 565) {
        SCREENSIZE.push('sm');
    }
    if(width > 767) {
        SCREENSIZE.push('md');
    }
    if(width > 991) {
        SCREENSIZE.push('lg');
    }
    if(width > 1199) {
        SCREENSIZE.push('xl');
    }
    $('body').attr('data-screen', SCREENSIZE.slice(-1)[0]);
}

function setIcons(activeCat) {
    var $block = $('header .last');
    $.each(HEADER_ICONS[activeCat], function(idx, iconData) {
        $headerIcon = $block.find('.'+iconData.type);
        $headerIcon.find('.dynamic-icon').attr('class', 'fa fa-stack-1x fa-'+iconData.icon+' dynamic-icon');
        $headerIcon.find('.icon-text').text(iconData.text);
        $headerIcon.removeClass('inactive');
    });
}

function setHeaderIconImage() {
    $('header .block.middle .logo-wrapper .header-center-image').attr('src', '/img/header/cogensoft-'+SCREENSIZE.slice(-1)[0]+'-active.png');
}

function updateNav() {
    var $activeSection = $(".nav li.active");
    var sectionName = $activeSection.attr('data-slug');
    var mobileNav = ($.inArray('md', SCREENSIZE) === -1);
    var isCollapsed = $('.navbar-default .navbar-toggle').hasClass('collapsed');
    var $navigationIcon = (mobileNav) ? $('.navigation-piece.mobile.icon') : $('#navigation-container .icon');
    var $navigationLine = (mobileNav) ? $('.navigation-piece.mobile.down') : $('#navigation-container .line');
    var iconPrefix = (mobileNav) ? '/img/cogensoft-icons/cogensoft-mob-nav' : '/img/cogensoft-icons/cogensoft-nav';
    var variableLineCssProp = (mobileNav) ? 'height' : 'width';
    var $navigationConnector = $('#navigation-container .connector');
    var lineLength = null;
    SCREENSIZE.forEach(function(size) {
        if(typeof $activeSection.attr('data-'+size+'-length') !== 'undefined') {
            lineLength = $activeSection.attr('data-'+size+'-length')+'px';
        }
    });

    $('.navigation-piece.line').addClass('hidden').css({'width': '', 'height': ''});
    switch(sectionName) {
        case 'welcome':
            $navigationIcon.attr('src', iconPrefix+"-0.png");
            $navigationConnector.addClass('hidden');
            break;
        case 'about':
            $navigationIcon.attr('src', iconPrefix+"-1.png");
            $navigationLine.removeClass('hidden').css(variableLineCssProp, lineLength);
            if(!mobileNav || !isCollapsed) $navigationConnector.removeClass('hidden');
            break;
        case 'technology':
            $navigationIcon.attr('src', iconPrefix+"-2.png");
            $navigationLine.removeClass('hidden').css(variableLineCssProp, lineLength);
            if(!mobileNav || !isCollapsed) $navigationConnector.removeClass('hidden');
            break;
        case 'values':
            $navigationIcon.attr('src', iconPrefix+"-3.png");
            $navigationLine.removeClass('hidden').css(variableLineCssProp, lineLength);
            if(!mobileNav || !isCollapsed) $navigationConnector.removeClass('hidden');
            break;
        case 'projects':
            $navigationIcon.attr('src', iconPrefix+"-4.png");
            $navigationLine.removeClass('hidden').css(variableLineCssProp, lineLength);
            if(!mobileNav || !isCollapsed) $navigationConnector.removeClass('hidden');
            break;
        case 'contact':
            $navigationIcon.attr('src', iconPrefix+"-5.png");
            $navigationLine.removeClass('hidden').css(variableLineCssProp, lineLength);
            if(!mobileNav || !isCollapsed) $navigationConnector.removeClass('hidden');
            break;
    }

    $('.navigation-piece.mobile:not(.icon):not(.collaped-icon)').addClass('hidden');
    if(mobileNav && sectionName !== 'welcome') $('.navigation-piece.mobile').removeClass('hidden');
}

//Carousel
var carousel = {
    _timer: null,
    init: function($carouselEl)  {
        var transitionMs = $carouselEl.attr('data-interval');
        var breakpoint = $carouselEl.attr('data-break');
        var _this = this;

        _this.addTransition($carouselEl, transitionMs, breakpoint);
        $(window).resize(function() {
           if($carouselEl.hasClass('initialised')) {
               $carouselEl.removeClass('initialised');
               clearInterval(_this._timer);
               _this.addTransition($carouselEl, transitionMs, breakpoint);
           }
        });
    },
    addTransition: function($carouselEl, transitionMs, breakpoint) {
        var _this = this;

        //Only update once per second
        setTimeout(function() {
            $carouselEl.addClass('initialised');
            var $panel = $carouselEl.find('.carousel-panel').first();
            var panelHeight = $panel.height();
            var panelWidth = $panel.width();
            var screenSize = $('body').attr('data-screen');

            if(SCREEN_SIZE_TYPES[screenSize] < SCREEN_SIZE_TYPES[breakpoint]) {
                //Horizontal scrolling
                _this._timer = setInterval(function () {
                    $carouselEl.trigger('beforeTransition');
                    $carouselEl.transition({x: (0 - (panelWidth + 15))}, 300, 'linear', function () {
                        _this.postTransition($carouselEl);
                    });
                }, transitionMs);
            }
            else {
                //Verical scrolling
                _this._timer = setInterval(function() {
                    $carouselEl.trigger('beforeTransition');
                    $carouselEl.transition({ y: (0 - (panelHeight + 15))}, 300, 'linear', function() {
                        _this.postTransition($carouselEl);
                    });
                }, transitionMs);
            }
        }, 500);
    },
    postTransition: function($carouselEl) {
        var panel = $carouselEl.find('.carousel-panel').first().detach();
        var activePanelFound = false;
        $carouselEl.transition({x: 0, y: 0}, 0).find('.carousel-panel').each(function() {
            if(activePanelFound) {
                $(this).addClass('active');
                activePanelFound = false;
            }
            else {
                if($(this).hasClass('active')) {
                    activePanelFound = true;
                    $(this).removeClass('active');
                }
            }
        });
        panel.removeClass('active');
        $carouselEl.append(panel);
        setTimeout(function() {
            $carouselEl.trigger('duringTransition');
            setTimeout(function() {
                $carouselEl.trigger('afterTransition');
                setTimeout(function() {
                    $carouselEl.trigger('complete');
                }, 800);
            }, 600);
        }, 600);
    }
};