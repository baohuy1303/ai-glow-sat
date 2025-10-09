function UserLayout({ children }) {
    return (
        <div>
            <Navbar />
            <h1>User Layout</h1>
            {children}
        </div>
    )
}

export default UserLayout;