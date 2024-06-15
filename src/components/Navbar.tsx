import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Button, buttonVariants } from './ui/button';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
	return (
		<>
			<nav className="sticky h-14 inset-0 top-0 z-30 w-full border-b border-zinc-100 bg-white/75 backdrop-blur-lg transition-all">
				<MaxWidthWrapper>
					<div className="flex h-14 items-center justify-between border-b border-zinc-200 ">
						<Link
							href={'/'}
							className="flex items-center z-40 font-semibold"
						>
							<span>DocQuery.</span>
						</Link>
						{/* TODO: add mobile navbar */}

						<div className=" hidden items-center justify-center space-x-4 sm:flex">
							<>
								<Link
									href={'/dashboard'}
									className={buttonVariants({
										variant: 'ghost',
										size: 'sm',
									})}
								>
									Dashboard
								</Link>
								<Link
									href={'/pricing'}
									className={buttonVariants({
										variant: 'ghost',
										size: 'sm',
									})}
								>
									Pricing
								</Link>
								<LoginLink>
									<Button
										variant="ghost"
										size={'sm'}
									>
										Sign In
									</Button>
								</LoginLink>
								<RegisterLink>
									<Button
										variant="default"
										size={'sm'}
									>
										Get Started{' '}
										<ArrowRight className="w-5 h-5 ml-2" />
									</Button>
								</RegisterLink>
							</>
						</div>
					</div>
				</MaxWidthWrapper>
			</nav>
		</>
	);
};

export default Navbar;
