<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $data = User::query()
            ->with('roles:id,name') // efisien, hanya ambil id & name
            ->when(
                $request->search,
                fn ($query, $search) =>
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
            )
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => [
                'data' => $data->getCollection()->transform(fn ($user) => [
                    'id'        => $user->id,
                    'name'      => $user->name,
                    'email'     => $user->email,
                    'is_active' => (bool) $user->is_active,
                    'roles'     => $user->roles->pluck('name')->toArray(),
                ]),

                'meta' => [
                    'current_page' => $data->currentPage(),
                    'last_page'    => $data->lastPage(),
                    'per_page'     => $data->perPage(),
                    'total'        => $data->total(),
                ],

                'links' => $data->linkCollection(),
            ],

            'filters' => [
                'per_page' => $request->integer('per_page', 10),
                'search'   => $request->input('search'),
            ],
        ]);
    }


    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_active' => true,
        ]);

        $user->syncRoles([$data['role']]);

        return to_route('users.index')->with('success', 'User created');
    }

    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active ?? true,
                'roles' => $user->roles->pluck('name'),
            ],
            'roles' => Role::pluck('name'),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $password = $data['password'] ?? null;

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'is_active' => $data['is_active'] ?? $user->is_active,
            'password' => $password
                ? Hash::make($password)
                : $user->password,
        ]);

        $user->syncRoles([$data['role']]);

        return to_route('users.index')->with('success', 'User updated');
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return back()->withErrors('You cannot delete your own account');
        }

        $user->delete();

        return to_route('users.index')->with('success', 'User deleted');
    }
}
