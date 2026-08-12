<template>
    <aside class="sidebar">
        <div class="sidebar-inner">
            <div class="logo">
                <span class="logo-mark">L</span>

                <div class="logo-content">
                    <strong>Loba</strong>
                    <span>CRM</span>
                </div>
            </div>

            <nav class="navigation">
                <div class="nav-section">
                    <span class="nav-label">Workspace</span>

                    <RouterLink to="/">
                        <span>Dashboard</span>
                    </RouterLink>

                    <RouterLink to="/prospects">
                        <span>Prospects</span>
                    </RouterLink>

                    <RouterLink to="/calls">
                        <span>Calls</span>
                    </RouterLink>

                    <RouterLink to="/follow-ups">
                        <span>Follow-ups</span>
                    </RouterLink>
                </div>

                <div class="nav-section">
                    <span class="nav-label">Manage</span>

                    <RouterLink to="/pipeline">
                        <span>Pipeline</span>
                    </RouterLink>

                    <RouterLink to="/clients">
                        <span>Clients</span>
                    </RouterLink>

                    <RouterLink to="/projects">
                        <span>Projects</span>
                    </RouterLink>

                    <RouterLink to="/tasks">
                        <span>Tasks</span>
                    </RouterLink>
                </div>
            </nav>

            <div class="sidebar-bottom">
                <RouterLink to="/settings">
                    <span>Settings</span>
                </RouterLink>

                <div class="sidebar-status">
                    <span class="status-dot"></span>
                    <span>Workspace active</span>
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    width: 15rem;
    min-width: 15rem;
    min-height: 100vh;
    padding: var(--space-4);

    box-sizing: border-box;

    background: var(--surface);
    border-right: 1px solid var(--border);

}

.sidebar-inner {
    height: 100%;

    display: flex;
    flex-direction: column;
}

/* Logo */

.logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);

    padding: var(--space-3);
    margin-bottom: var(--space-7);
}

.logo-mark {
    width: 2.25rem;
    height: 2.25rem;

    display: grid;
    place-items: center;

    background: var(--accent);
    color: #09090b;

    border-radius: var(--radius-sm);

    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 800;
}

.logo-content {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
}

.logo-content strong {
    font-family: var(--font-display);
    font-size: 1rem;
    letter-spacing: -0.02em;
}

.logo-content span {
    color: var(--text-muted);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

/* Navigation */

.navigation {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
}

.nav-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.nav-label {
    padding: 0 var(--space-3);
    margin-bottom: var(--space-2);

    color: var(--text-muted);

    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.navigation a,
.sidebar-bottom a {
    position: relative;

    display: flex;
    align-items: center;

    min-height: 2.75rem;
    padding: 0 var(--space-3);

    box-sizing: border-box;

    color: var(--text-muted);
    text-decoration: none;

    border: 1px solid transparent;
    border-radius: var(--radius-sm);

    transition:
        background 150ms ease,
        color 150ms ease,
        border-color 150ms ease;
}

.navigation a:hover,
.sidebar-bottom a:hover {
    background: var(--surface-raised);
    color: var(--text);
}

.navigation a.router-link-active,
.sidebar-bottom a.router-link-active {
    background: var(--surface-raised);
    border-color: var(--border);
    color: var(--text);
}

.navigation a.router-link-active::before,
.sidebar-bottom a.router-link-active::before {
    content: "";

    position: absolute;
    left: -1px;
    top: 50%;
    transform: translateY(-50%);

    width: 2px;
    height: 1.25rem;

    background: var(--accent);
    border-radius: 0 2px 2px 0;
}

/* Bottom */

.sidebar-bottom {
    margin-top: auto;

    display: flex;
    flex-direction: column;
    gap: var(--space-3);

    padding-top: var(--space-4);
    border-top: 1px solid var(--border);
}

.sidebar-status {
    display: flex;
    align-items: center;
    gap: var(--space-2);

    padding: 0 var(--space-3);

    color: var(--text-muted);
    font-size: 0.7rem;
}

.status-dot {
    width: 0.4rem;
    height: 0.4rem;

    background: var(--accent);
    border-radius: 50%;
}
</style>