import { OnlineUser } from "@/data/mockData";

interface Props {
  user: OnlineUser;
}

const OnlineUserAvatar = ({ user }: Props) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative w-14 h-14 rounded-full bg-muted border-2 ${user.borderColor} flex items-center justify-center`}>
        <span className="text-xl">👤</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <span className="text-[9px] font-space font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
            {user.level}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-cairo text-muted-foreground truncate w-14 text-center">
        {user.username}
      </span>
    </div>
  );
};

export default OnlineUserAvatar;
