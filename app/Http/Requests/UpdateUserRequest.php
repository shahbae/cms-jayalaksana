<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('Admin');
    }

    public function rules(): array
    {
        return [
            'name' => ['required','string','max:150'],
            'email' => [
                'required',
                'email',
                Rule::unique('users','email')->ignore($this->user->id),
            ],
            'password' => ['nullable','min:6'],
            'role' => ['required','string'],
            'is_active' => ['boolean'],
        ];
    }
}
