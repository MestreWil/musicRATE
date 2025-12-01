<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'spotify_album_id' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z0-9]+$/', // IDs do Spotify são alfanuméricos
            ],
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:10',
            ],
            'review_text' => [
                'nullable',
                'string',
                'max:2000',
                'min:10', // Mínimo de 10 caracteres se for enviar texto
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'spotify_album_id.required' => 'O ID do álbum do Spotify é obrigatório.',
            'spotify_album_id.regex' => 'ID do álbum inválido.',
            'rating.required' => 'A nota é obrigatória.',
            'rating.integer' => 'A nota deve ser um número inteiro.',
            'rating.min' => 'A nota mínima é 1.',
            'rating.max' => 'A nota máxima é 10.',
            'review_text.max' => 'O texto da review não pode ter mais de 2000 caracteres.',
            'review_text.min' => 'O texto da review deve ter no mínimo 10 caracteres.',
        ];
    }
}
