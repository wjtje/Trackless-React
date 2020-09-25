# How to show a update dialog

```jsx
const [open, setOpen] = useState((window.localStorage.getItem('lastVersion') !== version))
window.localStorage.setItem('lastVersion', version)
```

```jsx
<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogTitle>Trackless has been updated!</DialogTitle>
  <DialogContent>
    <DialogContentText>What's new in version {version}</DialogContentText>
    <ul>
      <li>A this that new is</li>
    </ul>
  </DialogContent>
  <DialogActions>
    <Button color='primary' onClick={() => setOpen(false)}>
      Close
    </Button>
  </DialogActions>
</Dialog>
```