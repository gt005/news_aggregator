"""empty message

Revision ID: f1788cd51849
Revises: f81be83eabd2
Create Date: 2024-03-19 00:00:07.998872

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'f1788cd51849'
down_revision: Union[str, None] = 'f81be83eabd2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('folder_news_folder_id_fkey', 'folder_news', type_='foreignkey')
    op.create_foreign_key(None, 'folder_news', 'folders', ['folder_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'folder_news', type_='foreignkey')
    op.create_foreign_key('folder_news_folder_id_fkey', 'folder_news', 'folders', ['folder_id'], ['id'])
    # ### end Alembic commands ###
