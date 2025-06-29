import {
	Debug,
	Language,
	LogoGithub,
	LogoNpm,
	LogoX,
} from "@carbon/icons-react";
import logo from "../assets/logo.svg";

export const AppFooter: React.FC = () => {
	const navItems = [
		{
			icon: Language,
			text: "English",
			onClick(e: React.MouseEvent<HTMLButtonElement>) {
				e.preventDefault();
			},
		},
		{
			icon: LogoX,
			text: "@lollipop_onl",
			href: "https://x.com/lollipop_onl",
		},
		{
			icon: LogoGithub,
			text: "ソースコード",
			href: "https://github.com/simochee/passport-mrz",
		},
		{
			icon: Debug,
			text: "不具合の報告",
			href: "https://github.com/simochee/passport-mrz/issues/new",
		},
		{
			icon: LogoNpm,
			text: "passport-mrz-builder",
			href: "https://www.npmjs.com/package/passport-mrz-renderer",
		},
		{
			icon: LogoNpm,
			text: "passport-mrz-renderer",
			href: "https://www.npmjs.com/package/passport-mrz-renderer",
		},
	];

	return (
		<footer className="bg-slate-700 text-slate-200 py-8 px-4">
			<div className="mx-auto w-full max-w-7xl flex flex-wrap justify-between gap-x-3 gap-y-5">
				<h1>
					<img src={logo} alt="MRZsim" width={134} height={32} />
				</h1>
				<aside className="flex items-end flex-col gap-3 flex-grow">
					<p className="text-sm">
						パスポート情報は個人情報です。入力内容の取り扱いにはご注意ください。
					</p>
					<nav className="flex gap-x-6 gap-y-2 justify-end max-w-md flex-wrap">
						{navItems.map(({ icon: Icon, text, href, onClick }) =>
							href ? (
								<a
									key={text}
									className="not-hover:text-slate-400 transition flex items-center gap-2 text-xs underline hover:no-underline"
									href={href}
									target="_blank"
									rel="noopener"
								>
									<Icon />
									{text}
								</a>
							) : (
								<button
									key={text}
									className="flex items-center gap-2 not-hover:text-slate-400 transition text-xs underline hover:no-underline"
									type="button"
									onClick={onClick}
								>
									<Icon />
									{text}
								</button>
							),
						)}
					</nav>
				</aside>
			</div>
		</footer>
	);
};
