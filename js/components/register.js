function SignupForm() {
    const [form, setForm] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [msg, setMsg] = React.useState("");
    const [error, setError] = React.useState("");

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg("");
        setError("");

        try {
            await window.userDb.createUser(form);
            setMsg("Account created! You're now logged in.");

            // If you have a separate page after signup:
            // window.location.href = "index.html";
        } catch (err) {
            setError(err.message || "Something went wrong.");
        }
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center text-orange-400 mb-2">
                Create Account
            </h1>
            <p className="text-center text-stone-500 mb-6">
                Join Purdue Foodies 🍊
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}/>

                <Input
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}/>

                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}/>

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}/>

                <button
                    type="submit"
                    className="w-full bg-orange-400 text-white py-3 rounded-xl font-semibold
                   hover:bg-orange-500 active:scale-[0.98]">
                    Sign Up
                </button>
            </form>

            {msg && <p className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">{msg}</p>}
            {error && <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}

            <p className="text-sm text-center text-stone-600 mt-4">
                Already have an account?{" "}
                <a href="login.html" className="text-orange-400 font-medium hover:underline">
                    Log in
                </a>
            </p>
        </div>
    );
}

function Input({ label, name, type = "text", value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-small text-stone-500 mb-1 ml-1">
                {label}
            </label>
            <input
                name={name}
                type={type}
                required
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2
                       focus:outline-none focus:ring-1 focus:ring-orange-300
                       focus:border-orange-300 text-stone-800"/>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("signup-root"));
root.render(<SignupForm />);