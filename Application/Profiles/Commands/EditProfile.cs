using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Commands
{
    public class EditProfile
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required EditProfileDTO ProfileDTO { get; set; }
        }

        public class Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userProfile = await userAccessor.GetUserAsync();

                mapper.Map(request.ProfileDTO, userProfile);

                context.Entry(userProfile).State = EntityState.Modified;

                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ?
                    Result<Unit>.Success(Unit.Value) :
                    Result<Unit>.Failure("Failed to update the user profile", 400);
            }
        }
    }
}