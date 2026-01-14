import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";

const LoginModal = () => {
  return (
    <Dialog open={true}>
      <DialogTrigger>Login</DialogTrigger>
      <DialogContent>
        <DialogTitle>Log in to your account</DialogTitle>
        <div>Login</div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
