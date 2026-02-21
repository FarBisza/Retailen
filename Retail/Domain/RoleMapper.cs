namespace Retailen.Domain
{
    public static class RoleMapper
    {
        public static string GetRoleName(int roleId) => roleId switch
        {
            1 => "Admin",
            2 => "Customer",
            3 => "Employee",
            4 => "Supplier",
            _ => "Customer"
        };

        public static bool IsAdmin(string? roleName)
            => string.Equals(roleName, "Admin", StringComparison.OrdinalIgnoreCase)
            || string.Equals(roleName, "Administrator", StringComparison.OrdinalIgnoreCase);
    }
}
