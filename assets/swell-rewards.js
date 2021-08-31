$(document).ready(function () {
  window.isSwellSetup = false;
  var timeInterval = setInterval(function () {
    if (!window.isSwellSetup && typeof (spapi) != "undefined" && spapi.authenticated != undefined) {
      window.isSwellSetup = true;
      clearInterval(timeInterval);

      setTimeout(function () {
        $(".swell-closepop-btn").click(function () {
          $(".swell-modal").css("display", "none");
        });

        $("body").on('click', '.swell-post-checkout-holder .checkout-heading .swell-referral-back-link', function (e) {
          $('.swell-post-checkout-kiava').css("display", "none");
        });

        $('.swell-referral-loader').hide();
        
        
        $('.swell-referral-loader-refer').hide();
        SwellConfig.Referral.initializeReferral(".swell-referral");

        // if ($(".swell-tier-table").length > 0) {
        //   SwellConfig.Tier.initializeCustomTierProperties();
        //   SwellConfig.Tier.initializeTiers(".swell-tier-table");
        //   SwellConfig.Tier.applytierSlickSlider('.swell-tier-table-body');
        // }

        $(".swell-referral-loader-cart").hide();
        $(".swell-cart-page").show();
        //swellAPI.populateSelectWithRedemptionOptions("select#redemptionoptions");

        $(".swell-redeem-btn").click(function () {
          $(".swell-redeem-btn-title").hide();
          $(".swell-referral-loader-redeem").show();
          var redemptionOptionSelect = $("#redemptionoptions");
          var value = redemptionOptionSelect.val();
          var selection = swellAPI.findActiveRedemptionOptionById(value);
          $("#swell-reward-heading").html("<h4>" + selection.name + "</h4>");
          $("#swell-coupon-intro").html("<p>" + selection.description + "</p>");
          var onSuccess = function (redemption) {
            $("#swell-reward-intro").html("<p>" + redemption.redemptionOption.reward_intro + "</p>");
            $("#swell-coupon-code").html("<p>" + redemption.couponCode + "</p>");
            $(".swell-modal").css("display", "block");
            $(".swell-redeem-btn-title").show();
            $(".swell-referral-loader-redeem").hide();
          };
          var onError = function (err) {
            $("#swell-reward-intro").hide();
            $("#swell-coupon-code").hide();
            $("#swell-redemption-error").html("Sorry, you don't have enough points for this reward.");
            $(".swell-modal").css("display", "block");
            $(".swell-redeem-btn-title").show();
            $(".swell-referral-loader-redeem").hide();
          };
          swellAPI.makeRedemption({
              redemptionOptionId: redemptionOptionSelect.val()
            },
            onSuccess,
            onError
          );
        });

        $(".swell-post-checkout-kiava").css("display", "flex");
      }, 2000);
    }
  }, 1000);

  // $(document).on("swell:referral:success", function () {
  //   populate_referrals(".swell-referral-table .table-data");
  // });

  $(document).on("swell:initialized", function() {

    populate_campaigns(".swell-campaign-list");

    swellAPI.getActiveRedemptionOptions().forEach(option => {
        if (option.appliesToId !== null) {
            $(".swell-redemptions-list").append('<li class="swell-redemption-option"> <div class="swell-redemption-option-content swell-redemption-link" data-redemption-option-id="' + option.id + '"> <div class="swell-redemption-option-cost">' + option.name + '</div> <div class="swell-redemption-option-value">' + option.cost_text + '</div> </div> </li>');
            // .append(
            //     $("<li>").addClass("swell-buy-product-btn").attr({
            //         "data-variant-id": option.appliesToId,
            //         "data-hide-logged-out": "true|false",
            //         "data-confirm-title": "Are you sure?",
            //         "data-confirm-btn-text": "Redeem",
            //         "data-error-type": "red",
            //         "data-error-title": "Whoops!",
            //         "data-error-okay-text": "Ok",
            //         "data-success-type": "green",
            //         "data-success-title": "Success!",
            //         "data-success-content": "Product was successfully added to your cart",
            //         "data-success-ok-btn": "Keep Shopping",
            //         "data-success-cart-btn": "View Cart",
            //         "data-success-cart-link": "/cart",
            //         "data-box-width": "400px",
            //         "data-mobile-box-width": "90%"
            //     })
            // );
        }
    });
  });


  $(document).on("swell:setup", function() {
    var activeRedeptions = swellAPI.getActiveRedemptionOptions();
    var vipTiers = swellAPI.getVipTiers();

    console.log('Active Redemptions:', activeRedeptions);
    console.log('Active Tiers:', vipTiers);

  });

  // $(document).on("swell:referral:error", function (jqXHR, textStatus, errorThrown) {
  //   if (textStatus && textStatus === "EMAILS_ALREADY_PURCHASED") {
  //     $(".refer-customer-error").remove();
  //     $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Sorry! Looks like this person has already made a purchase. Try referring another friend.</p>');
  //     $("#swell-referral-refer-emails").addClass("error-border");
  //   }
  //   if (textStatus && textStatus === "Please enter a valid email address") {
  //     $(".refer-customer-error").remove();
  //     $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Please enter valid email addresses seperated with commas</p>');
  //     $("#swell-referral-refer-emails").addClass("error-border");
  //   }
  // });
});

function populate_campaigns() {
  var activeCampaigns = swellAPI.getActiveCampaigns();

  activeCampaigns.forEach(function(campaign){
    $('.swell-campaign-list').append('<a class="swell-campaign-link" data-campaign-id="' + campaign.id + '" data-display-mode="modal" href="javascript:void(0)"><div><i class="swell-campaign-icon-content ' + campaign.icon + '"></i></div>' + campaign.title + '<span class="campaign--content">' + campaign.reward_text + '</span></a>');
  });

}

// (function () {
//   window.SwellConfig = window.SwellConfig || {};
//   SwellConfig.Tier = {
//     getCustomerTierRank: function () {
//       var customer_tier, intro_tier, rank, tiers;
//       customer_tier = spapi.customer.vip_tier;
//       tiers = spapi.activeVipTiers;
//       if (customer_tier && customer_tier.id) {
//         rank = $.grep(tiers, function (e) {
//           return e.id === customer_tier.id;
//         })[0].rank;
//         return rank;
//       } else {
//         intro_tier = $.grep(tiers, function (e) {
//           return e.swellrequiredAmountSpent === "$0" && e.swellrequiredAmountSpentCents === 0 && e.swellrequiredPointsEarned === 0 && e.swellrequiredPurchasesMade === 0 && e.swellrequiredReferralsCompleted === 0;
//         });
//         if (intro_tier.length > 0) {
//           return intro_tier[0].rank;
//         } else {
//           return null;
//         }
//       }
//     },
//     initializeCustomTierProperties: function () {
//       var activeVipTiers = spapi.activeVipTiers;
//       activeVipTiers[0].spend = "Qualifying Amount:<br>" + (activeVipTiers[0].points_earned) + "-" + ((activeVipTiers[1].points_earned) - 1) + " points";
//       activeVipTiers[0].point_multiplier = "1x";
//       activeVipTiers[0].birthday_reward = "100 Points";
//       activeVipTiers[0].new_release = "";
//       activeVipTiers[0].entering_tier = "";
//       activeVipTiers[0].exclusive_sale = "";
//       activeVipTiers[0].earn_more = "";

//       activeVipTiers[1].spend = "Qualifying Amount:<br>" + (activeVipTiers[1].points_earned) + "-" + ((activeVipTiers[2].points_earned) - 1) + " points";
//       activeVipTiers[1].point_multiplier = "1.5x";
//       activeVipTiers[1].birthday_reward = "150 Points";
//       activeVipTiers[1].new_release = "<div class='circle'>✓</div>";
//       activeVipTiers[1].entering_tier = "25% off single purchase";
//       activeVipTiers[1].exclusive_sale = "";
//       activeVipTiers[1].earn_more = "";

//       activeVipTiers[2].spend = "Qualifying Amount:<br>" + (activeVipTiers[2].points_earned) + "+ points";
//       activeVipTiers[2].point_multiplier = "2x";
//       activeVipTiers[2].birthday_reward = "200 Points";
//       activeVipTiers[2].new_release = "<div class='circle'>✓</div>";
//       activeVipTiers[2].entering_tier = "30% off single purchase";
//       activeVipTiers[2].exclusive_sale = "<div class='circle'>✓</div>";
//       activeVipTiers[2].earn_more = "";
//     },
//     initializeTiers: function (containerSelector) {
//       $(".swell-tier-table").append('<ul class="swell-tier-table-header"> <li class="swell-tier-list"> <div class="tier-list tier-status"></div> <div class="tier-list tier-value"></div> <div class="tier-list tier-name">Benefits</div> <div class="tier-list">Points multiplier</div> <div class="tier-list">Birthday reward</div> <div class="tier-list">Early access to new releases and promotions</div> <div class="tier-list">Coupon upon entering tier</div> <div class="tier-list">Exclusive Sales</div> </li> </ul> <ul class="swell-tier-table-body"</ul> ');
//       if ($(containerSelector).length === 0) {
//         return "";
//       }
//       tiers = spapi.activeVipTiers;
//       var next_info = "";
//       customer_tier_rank = SwellConfig.Tier.getCustomerTierRank();
//       for (var t = 0; t < tiers.length; t++) {
//         if (t == customer_tier_rank && spapi.authenticated) {
//           tiers[t].current_status = "Current status";
//           if (t + 1 < tiers.length) {
//             if ((tiers[t + 1].points_earned) - (spapi.customer.vip_tier_stats.points_earned) <= 0) {
//               tiers[t + 1].current_status = "Earn 0 more points to reach " + tiers[t + 1].name;
//             } else {
//               tiers[t + 1].current_status = "Earn " + ((tiers[t + 1].points_earned) - (spapi.customer.vip_tier_stats.points_earned)) + " more points to reach " + tiers[t + 1].name;
//             }
//           }
//         } else {
//           if (tiers[t].current_status == null || tiers[t].current_status == "undefined") {
//             tiers[t].current_status = "";
//           }
//         }
//         $(".swell-tier-table-body").append('<li class="swell-tier-list swell-' + tiers[t].name + '"> <div class="tier-list tier-status status-rank' + t + '">' + tiers[t].current_status + '</div> <div class="tier-list tier-value">' + tiers[t].spend + '</div> <div class="tier-list tier-name">' + tiers[t].name + '</div> <div class="tier-list">' + tiers[t].point_multiplier + '</div> <div class="tier-list">' + tiers[t].birthday_reward + '</div> <div class="tier-list">' + tiers[t].new_release + '</div> <div class="tier-list">' + tiers[t].entering_tier + '</div> <div class="tier-list">' + tiers[t].exclusive_sale + '</div> </li>');
//         if (tiers[t].current_status == "") {
//           $(".status-rank" + t + "").css('visibility', 'hidden');
//         }
//       }
//       if (!spapi.customer.vip_tier) {
//         if ((tiers[0].points_earned) - (spapi.customer.vip_tier_stats.points_earned) <= 0) {
//           $(".status-rank0").html("Earn 0 more points to reach " + tiers[0].name);
//         } else {
//           $(".status-rank0").html("Earn " + ((tiers[0].points_earned) - (spapi.customer.vip_tier_stats.points_earned)) + " more points to reach " + tiers[0].name);
//         }
//         $(".status-rank0").css("visibility", "visible");
//       }
//     },
//     applytierSlickSlider: function (containerSelector) {
//       if (spapi.isMobile) {
//         $(containerSelector).slick({
//           dots: true,
//           infinite: true,
//           speed: 300,
//           slidesToScroll: 1,
//           slidesToShow: 3,
//           prevArrow: false,
//           nextArrow: false,
//           responsive: [{
//             breakpoint: 768,
//             settings: {
//               slidesToShow: 1,
//               slidesToScroll: 1,
//             }
//           }]
//         });
//       }
//     }
//   }
// }).call(this);

(function () {
  window.SwellConfig = window.SwellConfig || {};
  SwellConfig.Redemption = {
    initializeRedemptions: function (selector) {
      spapi.activeRedemptionOptions.forEach(function (redemption) {
        if (redemption.discount_type === "fixed_amount") {
          $(selector).append('<li class="swell-redemption-option"> <div class="swell-redemption-option-content swell-redemption-link" data-redemption-option-id="' + redemption.id + '"> <div class="swell-redemption-option-cost">' + redemption.name + '</div> <div class="swell-redemption-option-value">' + redemption.cost_text + '</div> </div> </li>');
        }
      });
    }
  };
}).call(this);


function populate_referrals(selector) {
  if (spapi.customer.email) {
    $(selector).empty();
    spapi.refreshCustomerDetails(function () {
      spapi.customer.referral_receipts.forEach(function (referral_receipt) {
        if (referral_receipt.completed_at) {
          status = "Purchased (" + spapi.activeReferralCampaign.reward_text + ")";
        } else {
          status = "Invited";
        }
        $(selector).append("<tr><td>" + referral_receipt.email + "</td><td>" + status + "</td></tr>");
      });
    });
  }
}

(function () {
  window.SwellConfig = window.SwellConfig || {};
  SwellConfig.Referral = {
    opts: {
      localization: {
        referralSidebarDetailsAction: "",
        referralSidebarDetailsReward: "",

        referralRegisterHeading: "Give <%= referralCampaign.reward_text %>, Get <%= referralCampaign.reward_text %>",
        referralRegisterFormDetails: "Submit your email to get started.",
        referralRegisterFormEmail: "Your email address",
        referralRegisterFormSubmit: "Next",
        referralRegisterDetails: "<%= referralCampaign.details %>",

        referralReferHeading: "Give <%= referralCampaign.reward_text %>, Get <%= referralCampaign.reward_text %>",
        referralReferFormEmails: "Your friends' emails (separated by commas)",
        referralReferFormSubmit: "Send",
        referralReferFormDetails: "Now, enter your friends' emails.",
        referralReferFormEmailsDetails: "Separate by Commas",
        referralReferDetails: "<%= referralCampaign.details %>",

        referralReferMediaDetails: "You can also share your link with the buttons below.",

        referralShareFacebook: "Share",
        referralShareSMS: "SMS",
        referralShareTwitter: "Tweet",
        referralShareMessage: "Message",
        referralShareCopy: "Copy Link",

        referralFacebookIcon: "swell-icon-facebook-share-mob",
        referralSMSIcon: "swell-icon-sms-mob",
        referralTwitterIcon: "swell-icon-tweet-mob",
        referralMessageIcon: "swell-icon-fb-message-mob",
        referralLinkIcon: "swell-icon-copy-link-mob",

        referralThanksHeading: "Thanks for Referring!",
        referralThanksDetails: "Remind your friends to check their emails.",

        referralCopyHeading: "Copy Link",
        referralCopyButton: "Copy Link",
        referralCopyDetails: "Copy link and share with your friends."
      },
      templates: {
        referralRegister: '<div class="swell-referral-register"> <h2 class="swell-referral-heading"><span class="refer-heading">refer a friend</span><%= localization.referralRegisterHeading %></h2> <p class="swell-referral-details"> <%= localization.referralRegisterDetails %> </p> <div class="swell-referral-form-wrapper"> <form name="swell-referral-register-form" id="swell-referral-register-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"> <%= localization.referralRegisterFormDetails %> </p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="email" name="swell-referral-register-email" id="swell-referral-register-email" required="required" placeholder="<%= localization.referralRegisterFormEmail %>"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-register-submit" id="swell-referral-register-submit" value="<%= localization.referralRegisterFormSubmit %>"> </li> </ul> </div> </form> </div> </div>',
        referralRefer: '<div class="swell-referral-refer"> <h2 class="swell-referral-heading"><span class="refer-heading">refer a friend</span><%= localization.referralReferHeading %></h2> <p class="swell-referral-details"> <%= localization.referralReferDetails %> </p> <div class="swell-referral-form-wrapper"> <form class="swell-referral-form" name="swell-referral-refer-form" id="swell-referral-refer-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"> <%= localization.referralReferFormDetails %> </p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="text" name="swell-referral-refer-emails" id="swell-referral-refer-emails" required="required" placeholder="<%= localization.referralReferFormEmails %>"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-refer-submit" id="swell-referral-refer-submit" value="<%= localization.referralReferFormSubmit %>"> </li> </ul> </div> </form> </div> <div class="swell-referral-media-wrapper"> <p class="swell-referral-media-details"><%= localization.referralReferMediaDetails %></p> <ul class="swell-referral-media-list"> <li class="swell-referral-medium swell-share-referral-facebook"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralFacebookIcon %>" aria-hidden="true"></i>  <%= localization.referralShareFacebook %> </div> </li> <li class="swell-referral-medium swell-share-referral-sms"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralSMSIcon %>" aria-hidden="true"></i>  <%= localization.referralShareSMS %> </div> </li> <li class="swell-referral-medium swell-share-referral-messenger"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralMessageIcon %>" aria-hidden="true"></i>  <%= localization.referralShareMessage %> </div> </li> <li class="swell-referral-medium swell-share-referral-twitter"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralTwitterIcon %>" aria-hidden="true"></i>  <%= localization.referralShareTwitter %> </div> </li> <li class="swell-referral-medium swell-share-referral-copy"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i>  <%= localization.referralShareCopy %> </div> </li> </ul> </div> </div>',
        referralCopy: '<div class="swell-referral-copy"> <div class="swell-referral-copy-content"> <div class="swell-referral-copy-sidebar"> <img src="//cdn.shopify.com/s/files/1/2786/4584/t/17/assets/swell-copy-image.png?39498" class=""> </div> <div class="swell-referral-copy-main"> <span class="swell-referral-back-link"></span> <h2 class="swell-referral-heading"> <i class="swell-referral-heading-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i> <%= localization.referralCopyHeading %> </h2> <div class="swell-referral-form-wrapper"> <div class="swell-referral-copy-link" id="swell-referral-copy-link">RWRD.IO<br>/<%= customer.referralCode %></div> <button class="swell-referral-copy-button" id="swell-referral-copy-button" data-clipboard-target="#swell-referral-copy-link"><%= localization.referralCopyButton %></button> <p class="swell-referral-details"><%= localization.referralCopyDetails %></p> </div> </div> </div> <div>'
      }
    },
    initializeReferral: function (containerSelector) {
      var email = $(containerSelector).data("customer-email");
      if (email) {
        spapi.storage.setItem("referrer_email", email);
        spapi.customer.email = email;
      }
      Swell.Referral.initializeReferral(".swell-referral", SwellConfig.Referral.opts);
      populate_referrals(".swell-referral-table .table-data");
    },
  };
}).call(this);