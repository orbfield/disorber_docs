public class SidebarService
{
    private bool _isSidebarCollapsed;
    public bool IsSidebarCollapsed
    {
        get => _isSidebarCollapsed;
        set
        {
            if (_isSidebarCollapsed != value)
            {
                _isSidebarCollapsed = value;
                NotifyStateChanged();
            }
        }
    }

    public event Action OnChange;

    private void NotifyStateChanged() => OnChange?.Invoke();

    public void ToggleSidebar()
    {
        IsSidebarCollapsed = !IsSidebarCollapsed;
    }
}
