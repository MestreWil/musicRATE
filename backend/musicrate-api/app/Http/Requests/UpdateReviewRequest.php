<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Verifica se o usuário é dono da review
        return $this->user()->id === $this->route('review')->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'rating' => [
                'sometimes',
                'required',
                'integer',
                'min:1',
                'max:10',
            ],
            'review_text' => [
                'nullable',
                'string',
                'max:2000',
                'min:10',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'rating.integer' => 'A nota deve ser um número inteiro.',
            'rating.min' => 'A nota mínima é 1.',
            'rating.max' => 'A nota máxima é 10.',
            'review_text.max' => 'O texto da review não pode ter mais de 2000 caracteres.',
            'review_text.min' => 'O texto da review deve ter no mínimo 10 caracteres.',
        ];
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        throw new \Illuminate\Auth\Access\AuthorizationException(
            'Você não tem permissão para editar esta review.'
        );
    }
}
