<?php
define('MAILGUN_URL', 'https://api.mailgun.net/v3/cogensoft.co.uk');
define('MAILGUN_KEY', 'a58b83c655011b82fd9cab307f83871d-0470a1f7-502a50cb');

function sendmailbymailgun($to,$toname,$mailfromnane,$mailfrom,$subject,$text,$replyto){
    $array_data = array(
        'from'=> $mailfromnane .'<'.$mailfrom.'>',
        'to'=>$toname.'<'.$to.'>',
        'subject'=>$subject,
        //'html'=>$html,
        'text'=>$text,
        //'o:tracking'=>'yes',
        //'o:tracking-clicks'=>'yes',
        //'o:tracking-opens'=>'yes',
        //'o:tag'=>$tag,
        'h:Reply-To'=>$replyto
    );
    $session = curl_init(MAILGUN_URL.'/messages');
    curl_setopt($session, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($session, CURLOPT_USERPWD, 'api:'.MAILGUN_KEY);
    curl_setopt($session, CURLOPT_POST, true);
    curl_setopt($session, CURLOPT_POSTFIELDS, $array_data);
    curl_setopt($session, CURLOPT_HEADER, false);
    curl_setopt($session, CURLOPT_ENCODING, 'UTF-8');
    curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($session);
    curl_close($session);
    $results = json_decode($response, true);
    return $results;
}

// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['phone']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }

$name = $_POST['name'];
$email_address = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];

// Create the email and send the message
$to = 'contact@cogensoft.co.uk';
$toName = 'Cogensoft';
$email_subject = "Website Contact Form:  $name";
$email_body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message";
$headers = "From: contact@cogensoft.co.uk\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: $email_address";

sendmailbymailgun($to, $toName, $name, $email_address, $email_subject, $email_body, $email_address);
return true;

?>