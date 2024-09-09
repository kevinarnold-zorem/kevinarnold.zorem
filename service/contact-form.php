<?php

    //-----------------------------------------------------
	//----------- ----------------------
	$address= "kevinarnold.zorem@gmail.com";
	//-----------------------------------------------------
	//-----------------------------------------------------

	$name = $_POST["name"];
	$email = $_POST["email"];
	$phone = $_POST["phone"];
	$subject = "Formulario de Contacto";
	$message_content = $_POST["message"];
	if(!isset($name) || !isset($email) || !isset($message_content)){
		echo "¡Por favor complete todos los campos obligatorios!";
		exit;
	}
	$headers = "From: $name <$email>\r\n";
	$headers .= "Reply-To: $subject <$email>\r\n";

	$message = "--$mime_boundary \r\n";
	
	$message .= "Tiene un correo electrónico de su sitio web: \r\n";
	$message .= "Nombre: $name \r\n";
	$message .= "Email: $email \r\n";
	$message .= "Phone: $phone \r\n";
	$message .= "Asunto: $subject \r\n";
	$message .= "Mensaje: $message_content \r\n";
	$message .= "--$mime_boundary--\r\n";
	$mail_sent = mail($address, $subject, $message, $headers);
	if($mail_sent)
	{	
		echo $name. ": Gracias por contactar.";
	}
