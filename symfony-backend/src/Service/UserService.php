<?php

namespace App\Service;
use Symfony\Component\Uid\Uuid;

// uuid generator
class UserService{
    public function generateUuid():string
    {
        return UUid::v4()->toRfc4122(); // Generiert eine UUID v4 im Standard-Format
    }

}

