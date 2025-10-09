function AdminLayout({ children }) {
    return (
        <div>
            <Navbar />
            <h1>Admin Layout</h1>
            {children}
        </div>
    )
}

export default AdminLayout;