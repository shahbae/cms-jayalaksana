<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('Admin');
    }

    public function rules(): array
    {
        return [
            'name' => ['required','string','max:150'],
            'email' => ['required','email','unique:users,email'],
            'password' => ['required','min:6'],
            'role' => ['required','string'],
        ];
    }
}
